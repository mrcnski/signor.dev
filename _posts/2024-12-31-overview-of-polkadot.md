---
categories: blockchain
description: Overview of the Polkadot blockchain, from my perspective as an ex core engineer.
---

This overview is from my perspective, as an ex core engineer. It's been almost a year since I left Polkadot -- please email me if any information is outdated or otherwise incorrect!
{: .note}

## Introduction

Polkadot is a proof-of-stake chain which acts as a relay chain for other chains. This means that validator nodes, who hold stake in the network, are able to provide security for Polkadot as well as any connected chains at the same time. This makes it easier for new chains to launch operation, and they also benefit from Polkadot's shared security.

{% include image.html name="overview-of-polkadot/resort.jpeg" alt="Resort" caption="Sunrise at a Parity retreat." width="500" %}

## Validators

Proof of stake means that there is no mining (unnecessary computations to solve a "math puzzle") as there is in PoW. In PoS, blocks cost little to produce. Instead, security comes from validators, who have significant economic stake in the network. Their stake incentivizes them to keep the network running well and honestly, and there are also penalties if they try to mess with the network to benefit themselves. Time is broken up into sessions, and each session a random set of Validators is chosen to be responsible for selecting blocks. (To select the validators we use a cryptographic "nominated PoS" algorithm called BABE).

Block "finalization" is actually done in multiple phases. This is for the purposes of scalability, as only a small set of nodes does the initial checking of potentially-suspect candidate blocks. The first phase is called backing, when a small set of validators "backs" or vouches for a block. Then a larger set of validators engages in approval voting. For both phases, a certain proportion of validators has to vote in favor of the block for it to move forward in the process. Dissenting validators are economically punished after a dispute process.

## Asynchronous Backing

In asynchronous backing, a backed block can be assumed to be valid before it's actually finalized, and collators/backers can build on top of the block as it's pending. This works because, most of the time, blocks are really valid. Async backing replaces the existing backing strategy, which waited for a block to be finalized before building on it (like a waterfall model) -- async backing results in faster blocks on average. I worked mostly on the statement-distribution subsystem, which determines how statements about block candidates are communicated from backers to other validators. The aim was to distribute statements in a way that was sound and robust, but also performant.

{% include image.html name="overview-of-polkadot/work-and-snow.jpeg" alt="Work and Snow" width="500" %}

## PVF (Polkadot Validation Function)

At my time at Parity I mostly worked on the code surrounding PVFs. PVF stands for Polkadot Validation Function and is the custom code that is used for each parachain to determine if a parachain block is valid. The PVF lives on-chain and a parachain can upgrade it. Since it lives on-chain, every validator should have access to the same, up-to-date PVF code. Given a block, validators responsible for it (whether backing, approving, or resolving a dispute) will execute the PVF for the block in a sandbox. Then the validator decides if it should vote for or against the given block, or abstain.

## Coretime

I also worked on a new technology called Coretime. The idea behind this is to treat Polkadot's validators as a computational resource, similar to CPU cores. Dedicated parachains could, after winning an auction for it, lease a core for a set period of time. Alternatively, chains that don't need to continuously produce blocks can request cores on-demand, paying the current core price determined by supply and demand. In this way, Polkadot is able to provide both stability as well as flexibility, depending on the needs of a given chain. Cores are an abstraction, and the safe number of cores is determined by measuring how much work Polkadot is able to do in parallel.

## Conclusion

There is of course much more to Polkadot, and more to come in the future, but I hope that this short overview was helpful!

{% include image.html name="overview-of-polkadot/seaside.jpeg" alt="Seaside" caption="Working on async backing by the sea." width="500" %}
