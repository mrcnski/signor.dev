---
categories: blockchain
description: In my last post I gave a general overview of Polkadot. Here I do a more detailed retrospective on how exactly I secured Polkadot validator nodes -- and why they needed to be secured in the first place.
toc: true
---

* Table of contents.
{:toc}

In my [last post](/overview-of-polkadot) I gave a general overview of Polkadot. Now I would like to do a more detailed retrospective on how exactly I secured Polkadot validator nodes -- and why they needed to be secured in the first place.

Let's first review some essential concepts:

- **Polkadot:** a network where many chains are connected and secured through a "relay chain".
- **Validators:** special nodes on the network that are entrusted with validating blocks from other chains.
- **PVF:** the Polkadot Validation Function, which is custom validation logic that is specific to each chain. Validators run this logic when validating candidate blocks for each chain.
- **Core:** a unit of work that Polkadot is able to provide. A chain can either have exclusive, long-term access to a core, or, more recently, can purchase **on-demand coretime** (instantaneous access to a core).

## The Problem

PVFs are usually written in Rust and transpiled to [WASM](https://wiki.polkadot.network/docs/learn-wasm), a standardized cross-platform format. WASM is reasonably efficient and secure, running in a runtime which, in theory, restricts the operations of the WASM code.

In practice, however, the WASM runtime does not itself provide much security apart from trying to restrict operations. This means that if a malicious attacker were to craft some PVF code that could escape the runtime, for example by exploiting a bug, he could potentially gain access to the host system.

We were particularly concerned about the potential theft of **validator keys**, which could allow an attacker to impersonate a validator. Other concerns included attackers initiating disputes -- resulting in loss of stake and real economic damage to the network -- as well as attackers DOSing or otherwise stalling the network. I should remind the reader that secure and deterministic execution of PVFs is *critical* in maintaining consensus for Polkadot!

In fact, escapes from the runtime sandbox were more than a theoretical possibility, as multiple CVEs (exploits) had been reported in wasmtime (our WASM compiler and runtime).[^cves]
{: .note}

[^cves]: These CVEs include [memory access outside of the sandbox](https://github.com/advisories/GHSA-ff4p-7xrq-q5r8) and [arbitrary code execution](https://security.snyk.io/vuln/SNYK-RUST-WASMTIME-2958083) (see also [this CVE](https://security.snyk.io/vuln/SNYK-RUST-WASMTIME-5902997)). Another possible attack vector was simply [crashing the node](https://nvd.nist.gov/vuln/detail/cve-2024-47763). The existence of this last CVE proved the theoretical possibility of an attacker DOSing the network (before my changes, PVFs were executed in the same process space as the rest of the Validator node).

Now, for most of Polkadot's history there were not that many chains that actually had PVFs running on the network. A chain had to invest in purchasing a long-term lease to get on the network, and there were not that many lease slots available. However, [**on-demand coretime**](https://wiki.polkadot.network/docs/learn-agile-coretime#on-demand-coretime) was approaching, which would make it much easier to get PVFs onto the network to be executed by validators, with much lower economic investment and scrutiny.

## First Step: `seccomp`

Our first thought was to simply use `seccomp` to sandbox the node. `seccomp` is a Linux utility wherein a process imposes a permanent self-restriction on the syscalls that it's allowed to make. If we could restrict the node's unnecessary access to the kernel, then on top of the limited execution enforced by the WASM runtime, we could feel reasonably confident that any potential attacks were neutered.

This may not be surprising to those who have used `seccomp` before, but this turned out to be very difficult to do correctly, especially in the context of consensus. We could easily block syscalls that were problematic from a security perspective, but what if they were triggered by wasmtime when running a PVF in a legitimate way? We could not test every possible code path that the wasmtime runtime could take. We also had no control over wasmtime -- it was a third-party dependency which could introduce new syscalls at any time.

## Binary Separation

One prerequisite for any solution using `seccomp` was to move the PVF workers into binaries that were separate from the main node, so that any restrictions imposed on the PVF workers did not restrict the function of the rest of the node. We knew that, even if our research into `seccomp` came to a dead-end, binary separation would be useful for other sandboxing efforts (see below) while also providing some security in and of itself.[^rop]

[^rop]: For example, splitting out the binaries provided a smaller surface area for potential [ROP](https://en.wikipedia.org/wiki/Return-oriented_programming) attacks.

Binary separation was a surprisingly large effort. Apart from the refactoring involved, there were a lot of subtle intricacies, and many opinions on how best to do this. Even getting reviews was difficult, and the team resorted to [click-bait tactics](https://github.com/paritytech/polkadot/pull/7337).

One of the biggest unforeseen engineering challenges was keeping the versions of the different binaries in sync. We added a mechanism that would attempt to rebuild all binaries if any of them changed, but it seemed to not always be reliable. We did manage to harden this mechanism, and additionally added version checks at node startup. We provided verbose error messages for a good user experience for the rare case where the mechanism failed.

## Landlock

Things were already getting quite complex, and we had a deadline. This is where we put together a threat model and decided that, at a minimum, we needed to prioritize protecting validator keys. We identified two requirements to accomplish that: **restricting filesystem access** and **restricting network access**.

To my pleasant surprise, I found a Linux utility that promised to do both! **Landlock** was fairly new, and didn't support network restriction just yet, but it did already support fine-grained filesystem access controls.[^fs] Even better, Landlock already had a fairly easy-to-use [Rust library](https://github.com/landlock-lsm/rust-landlock). It was perfect!

[^fs]: These fine-grained FS controls were useful to us, as the PVF workers had to read and write PVFs from the filesystem. We considered using IPC mechanisms such as shared memory to communicate PVFs between processes, but we determined that that would be detrimental to performance and an increase in complexity.

This was the most straight-forward measure to implement, and it felt very much like the right way to sandbox a process. After all, this facility was designed exactly for that purpose. The biggest change we needed to make was to rework the node file structure to give each PVF worker [its own sandboxed directory](https://github.com/paritytech/polkadot-sdk/pull/1373) to work in. Then we gave PVF workers full access to perform their filesystem operations within this directory only, being confident that they couldn't escape it.

Here is the code, stripped down a bit. `enable_for_worker` is what a worker binary would call directly. This function grants filesystem access rights to the worker directory, with the kind of access depending on the kind of worker. Access to any other file or directory is denied by default. `try_restrict` is where we actually construct the ruleset and then restrict the current process.

{% highlight rust linedivs %}
/// Landlock ABI version. We use ABI V1 because:
///
/// 1. It is supported by our reference kernel version.
/// 2. Later versions do not (yet) provide additional security that would benefit us.
pub const LANDLOCK_ABI: ABI = ABI::V1;

/// Try to enable landlock for the given kind of worker.
pub fn enable_for_worker(worker_info: &WorkerInfo) -> Result<()> {
    let exceptions: Vec<(PathBuf, BitFlags<AccessFs>)> = match worker_info.kind {
        WorkerKind::Prepare => {
            vec![(worker_info.worker_dir_path.to_owned(), AccessFs::WriteFile.into())]
        },
        WorkerKind::Execute => {
            vec![(worker_info.worker_dir_path.to_owned(), AccessFs::ReadFile.into())]
        },
    };

    try_restrict(exceptions)
}

fn try_restrict<I, P, A>(fs_exceptions: I) -> Result<()>
where
    I: IntoIterator<Item = (P, A)>,
    P: AsRef<Path>,
    A: Into<BitFlags<AccessFs>>,
{
    let mut ruleset =
        Ruleset::default().handle_access(AccessFs::from_all(LANDLOCK_ABI))?.create()?;
    for (fs_path, access_bits) in fs_exceptions {
        let paths = &[fs_path.as_ref().to_owned()];
        let mut rules = path_beneath_rules(paths, access_bits).peekable();
        if rules.peek().is_none() {
            // `path_beneath_rules` silently ignores missing paths, so check for it manually.
            return Err(Error::InvalidExceptionPath(fs_path.as_ref().to_owned()))
        }
        ruleset = ruleset.add_rules(rules)?;
    }

    let status = ruleset.restrict_self()?;
    if !matches!(status.ruleset, RulesetStatus::FullyEnforced) {
        return Err(Error::NotFullyEnabled(status.ruleset))
    }

    Ok(())
}
{% endhighlight %}

## Other Efforts

Okay, nothing is perfect. Landlock was still a relatively new Linux feature, and we knew from telemetry that many nodes on the network did not yet support it. We needed some additional measures. Luckily, we found some that added security on their own and could also be safely stacked with Landlock.

First, we used `unshare` combined with `pivot_root` as an improved verison of `chroot` filesystem sandboxing. This wasn't a perfect security solution, but it was better than nothing in the case where Landlock was unavailable.

I also mentored a third-party contributor who volunteered his time to implement some hardening that utilized [secure process creation](https://github.com/paritytech/polkadot-sdk/pull/1685) (see also [this PR](https://github.com/paritytech/polkadot-sdk/pull/2477)). I happily added [some diagrams](https://github.com/paritytech/polkadot-sdk/pull/2579) giving an overview of the new sandbox boundaries.

{% include image.html name="securing-polkadot-nodes/diagram.jpg" alt="PVF flow diagram." width="650" %}

## Getting Back to `seccomp`

Work progressed on `seccomp` this whole time. After binary separation, we removed as many dependencies from the PVF binaries as possible, limiting the scope of their functionality and (hopefully) the number of syscalls they made. We also implemented a static analysis script to get an expectation of the syscalls made by the PVF binaries. We ran this script in a CI pipeline to catch any new syscalls introduced when updating the wasmtime dependency.

Unfortunately, the number of syscalls detected with static analysis was quite high, and some of them were rather concerning from a security standpoint. And while we now had the capability to detect new syscalls introduced by wasmtime, we did not have complete confidence in our script. If it missed any syscall that then was triggered in production, consensus would break.

Considering all the other measures we already had in place, we decided to use `seccomp` but in a very small scope: preventing **network IO**. We only filtered a few specific syscalls: the creation of sockets, and the `iouring` entrypoint. The small scope of this filter meant that very little could go wrong, especially with the static analysis script as a reasonable, if imperfect check.

{% highlight rust linedivs %}
/// The action to take on caught syscalls.
#[cfg(not(test))]
const CAUGHT_ACTION: SeccompAction = SeccompAction::KillProcess;
/// Don't kill the process when testing.
#[cfg(test)]
const CAUGHT_ACTION: SeccompAction = SeccompAction::Errno(libc::EACCES as u32);

/// Applies a `seccomp` filter to disable networking for the PVF threads.
fn try_restrict() -> Result<()> {
    let mut blacklisted_rules = BTreeMap::default();

    // Restrict the creation of sockets.
    blacklisted_rules.insert(libc::SYS_socketpair, vec![]);
    blacklisted_rules.insert(libc::SYS_socket, vec![]);

    // Prevent connecting to sockets for extra safety.
    blacklisted_rules.insert(libc::SYS_connect, vec![]);

    // Restrict io_uring.
    blacklisted_rules.insert(libc::SYS_io_uring_setup, vec![]);
    blacklisted_rules.insert(libc::SYS_io_uring_enter, vec![]);
    blacklisted_rules.insert(libc::SYS_io_uring_register, vec![]);

    let filter = SeccompFilter::new(
        blacklisted_rules,
        // Mismatch action: what to do if not in rule list.
        SeccompAction::Allow,
        // Match action: what to do if in rule list.
        CAUGHT_ACTION,
        TargetArch::x86_64,
    )?;

    let bpf_prog: BpfProgram = filter.try_into()?;

    // Applies filter (runs seccomp) to the calling thread.
    seccompiler::apply_filter(&bpf_prog)?;

    Ok(())
}
{% endhighlight %}

## Secure Validator Mode

When discussing these solutions, there is a lot of detail I am leaving out in a (futile) attempt to keep this article short. One important detail, however, is that not all of these measures are possible on every system. `seccomp`, for example, is possible to disable system-wide.

Ideally, all of these measures would be mandatory to keep the network secure and **deterministic**. Determinism is a whole other can of worms, but in a nutshell: if a PVF triggered a sandbox violation on one computer but not another (because e.g. the other computer did not have sandboxing enabled), there would be a non-deterministic result and therefore no consensus. In other words, if some validators reported "valid" for a block, while others reported "invalid", there was a break in consensus, with consequences to nodes and potentially the network.

We figured that as long as *most* nodes had sandboxing enabled, we didn't have to worry too much.[^better] Validators should have the choice of disabling the security measures, at their own risk. So we made the sandbox on by default (except for certain measures in certain cases), but we provided an opt-out switch. [**Secure Validator Mode**](https://github.com/paritytech/polkadot-sdk/pull/2486) was born. If sandboxing could not be fully enabled on a machine, we would display very descriptive warnings and/or errors as well as instructions on how to disable Secure Validator Mode. We made some small hiccups in this process, but otherwise did not receive any complaints from node operators!

[^better]: It seemed good to prevent successful attacks for as many nodes as possible, and there were already other sources of nondeterminacy, anyway.

## What's Next?

Securing consensus was a big effort, and I was aware throughout this process that the clock was ticking. We needed for at least validator keys to be secure before on-demand coretime arrived on the network. I'm proud to report that, with some reasonable compromises made, me and my team did meet that deadline with some months to spare.

Even with all this effort, PVF execution was not perfectly secure or deterministic. We were fairly confident that attackers couldn't access the host machine or steal keys, but other attacks still existed. A PVF that escaped the WASM sandbox could, for example, tap into some source of randomness and return a non-deterministic result.[^randomness]

[^randomness]: We had [some ideas](https://github.com/paritytech/polkadot-sdk/issues/634) for minimizing sources of randomness, but it seemed a sisyphean task.

To fully address these concerns, there were discussions about running PVFs inside of an actual VM, specifically KVM. However, a much more promising alternative appeared on the horizon: [**PolkaVM**](https://github.com/paritytech/polkavm). This is Polkadot's own work-in-progress VM, based on the more efficient and simpler RISC-V standard. Not only would Polkadot control this dependency (unlike with wasmtime, Polkadot could limit the introduction of new syscalls), but it is being built from the ground-up with security as a primary objective.[^direct]

[^direct]: Indeed, it seems better long-term to fix the problems with PVF execution by directly addressing this layer of the stack, instead of applying more band-aids on top of it.

I hope you enjoyed this adventure in securing this critical component of Polkadot!

## Footnotes
