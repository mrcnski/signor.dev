---
layout: default
---

## Parity

I worked at Parity on Polkadot for ~1 year.

- **PVF (Polkadot Validation Function)**
  + Determinism measures
    - Use CPU time instead of wall clock time for timeouts
    - Separate errors into internal vs. PVF-related, general cleanup of errors
    - Log memory metrics
    - Retry under certain conditions
    - OOM detection (research + review)
  + Security
    - Researched various sandboxing techniques
    - Separated PVF workers into separate processes, bundled with the node
      binary.
      + Remove unnecessary dependencies
      + Worker version checks
    - Implemented networking restrictions using `seccomp`, with strict CI controls
      to ensure that no legitimate syscalls were blocked
    - Implemented sandboxed worker dir
    - Implemented filesystem restrictions using `landlock`, `unshare` and
      `pivot_root`
    - Made some restrictions optional based on which other restrictions were
      successfully enforced
    - Secure Validator Mode, with option to allow for operators to disable
      sandboxing
  + Documented system workings and assumptions, with diagrams
- **Async backing**
  + Wrote high-level and code-level documentation
  + Wrote much of the test suite
  + Enabled async backing on system chains
- **Coretime**
  + Reviewed implementation and identified errors
  + Helped test
- **Other**
  + Fixed OOM attack in `BoundedVec`
  + Remove unused/broken memory stats
  + Mentored contributors

## Skynet Labs

I worked here for ~2.5 years.

- **Skynet Token**
  - Creation of types, project structure
  - Implemented custom, efficient encoding scheme.
  - Implemented block mining using `lowpow` hash function.
    - Updating totals
    - Emergency mode
  - Implemented empty block validation.
  - Ran pedantic clippy to find possible logical/arithmetic errors
- **MySky**
  - Client/MySky/UI architecture
  - window/iframe communication, handshakes
  - Passphrase generation and validation.
  - Permissions system.
  - Encrypted files
    - path seed derivation/sharing
    - file padding
    - encryption using the secret path seed.
  - Implemented discoverable files derivation scheme.
- **MySky Auto-Login**
  - Preferred portal redirect
- **Registry proof validations**
- **Browser SDK**
  - Safe/performant database (SkyDB) gets/sets using cache and mutexes.
  - Wrote a tutorial with examples and challenge questions.
- **Substrate SDK**
  - `no_std` environment, manual string handling (without std library)
  - Used Substrate APIs to make requests
  - Example OCW node
- **Other SDKs**
  - Node, Golang, Python
  - Idiomatic, well-documented, well-tested code
- **Large File Uploads**
  - Implemented resumable large file uploads using the tus protocol, in Browser
    SDK and Node SDK.
  - Implemented ability in `tus-js-client` to use custom part boundaries
  - Implemented ability in `tus-js-client` to optimally schedule parallel chunk
    uploads, so that chunk uploads can start with a stagger (avoiding pauses)
- **siad (Sia daemon written in Golang)**
  - Helped implement MDM (Merklized Data Machine)
- **Other**
  - Community Involvement
  - Helped conduct interviews
