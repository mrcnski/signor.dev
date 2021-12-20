---
title: "Rust Beyond The Borrow Checker"
date: 2020-04-24
toc: true
categories: programming rust
description: ""
---

- Table of contents.
  {:toc}

Everyone's heard about the Rust borrow checker. It is one of the main draws of the language, contributing to the manifold safety and performance advantages that make Rust so appealing.

However, the benefits of Rust extend beyond the borrow checker. Due to the careful design of the language, which prioritized both speed and security from the beginning and which drew together some of the best existing -- and novel -- ideas in programming language theory, Rust is able to drastically reduce a number of other types of program error as well.

## What Is The Borrow Checker?

The borrow checker solves entire classes of bugs related to thread-unsafety which plague other systems-level languages like the derelict C. For example, [dangling pointers](https://en.wikipedia.org/wiki/Dangling_pointer) are common in C code and hard to avoid, and continue to result in security vulnerabilities that, in the modern world, have the potential to seriously affect people's lives.

The borrow checker is the part of the compiler that enforces ownership, borrowing, and lifetime rules at compile-time. I won't go into further explanation in this article; if you're not familiar with the borrow checker and how it prevents bugs, I would recommend reading the [relevant chapters](https://doc.rust-lang.org/1.8.0/book/ownership.html) in the Rust book as well as [this blog post](http://squidarth.com/rc/rust/2018/05/31/rust-borrowing-and-ownership.html).

## The Type System

One of the most obvious ways for a programming language to prevent bugs in written code is for the language to be statically typed. This means that type-level errors -- say, passing a string into a function that accepts an integer -- simply will not compile. Every object has a statically-known type. This is in contrast with dynamically typed languages, which can contain type errors and still be run or compiled.

While dynamic typing may be useful for quickly writing small programs, it is extremely dangerous and not advisable in released, production-level software. The potential for error is simply too high and, while tests can be written, not all type errors can be caught by tests, which have to be meticulously written and maintained.

Dynamic type systems are also scary to refactor. When changing around function signatures, custom data structures, or taking out a part of a function into a new function, it is very easy to make type errors by passing the wrong type around somewhere. While refactoring is not a completely error-free process even in statically typed languages, luckily, the computer can at least check that the new code after the changes is consistently typed. This frees up the programmer's mental capacity to focus on other areas of program correctness that the compiler can't automatically detect.

### Strong typing

In addition to being statically typed, Rust is also "strongly typed". While not a well-defined term, but you can imagine that there is a continuum of "strong-typedness" and that Rust has fewer ways to subvert the type system than some other low-level languages like C or C++.

{% highlight c linedivs %}
char a = 'a';
printf("%c", a + 1); // prints 'b'
{% endhighlight %}

{% highlight rust linedivs %}
let a = 'a';
println!("{}", a + 1); // error[E0369]: cannot add `{integer}` to `char`
{% endhighlight %}

This is critical for Rust because a lot of its safety relies on the guarantees provided by the type system. Crucially, things like whether an object is mutable or not are specified at the type level, and to subvert these kinds of guarantees tends to require some finagling (Rust deliberately makes it hard and verbose to do so) or the use of unsafe code.

Let's quickly look at how we might provide interior mutability for a type that is not `mut`:

{% highlight rust linedivs %}

{% endhighlight %}

For a more in-depth analysis of type systems, I would recommend [this article](http://blog.steveklabnik.com/posts/2010-07-17-what-to-know-before-debating-type-systems).

## Safe vs. Unsafe

Languages with pointers and low-level memory access are notoriously error-prone. The programmer has more control over memory, but he has to be careful not to break any implicit constraints with the amount of control he has.

For example, what happens when the program tries to access memory outside the bounds of an array or [dereference a null pointer](https://en.wikipedia.org/wiki/Null_pointer#Null_dereferencing)? The C standard, perhaps surprisingly, says that anything may happen at this point. This is called [undefined behavior](https://en.wikipedia.org/wiki/Undefined_behavior). Compilers are allowed to assume that the program will not enter an invalid state and can [make optimizations](https://en.cppreference.com/w/cpp/language/ub#UB_and_optimization) based on this assumption. When this assumption is broken, bad, unexpected things happen, including security vulnerabilities and exploits such as [arbitrary code execution](https://en.wikipedia.org/wiki/Arbitrary_code_execution).

Even more scary is how easy it is to trigger undefined behavior.

{% highlight c linedivs %}
int arr[4] = {0, 1, 2, 3};
int n = arr[4]; // undefined behavior for indexing out of bounds
{% endhighlight %}

Rust is a systems-level programming language with direct pointer access. Like C and C++ it foregoes memory-safety through garbage collection for the sake of performance and greater control. However, unlike other systems languages, Rust avoids the pitfalls of allowing pointer access by not allowing it _all the time_.

In fact, most code in Rust that you'll see and write is "safe" Rust. This is the default state of Rust code, in which the compiler disallows dereferencing raw pointers. If you want to do so anyway, you must mark a scope as `unsafe`. Doing this signals to the compiler that you know what you're doing, and you are assuming unto yourself the responsibility of checking that memory accesses within the scope are valid.

Calling a function which is `unsafe` is itself an unsafe operation, and needs to be done inside an `unsafe` block. For example, the std function `mem::transmute`, which casts a value of one type directly to another type, is marked `unsafe` in its signature:

{% highlight rust linedivs %}
// Signature
pub unsafe fn transmute<T, U>(e: T) -> U

// Calling the function
let output = unsafe { mem::transmute(input) };
{% endhighlight %}

This function is unsafe because the caller has to ensure he is using it in a safe manner -- the function cannot provide these guarantees for you.

A function can contain `unsafe` blocks in its implementation without being `unsafe` itself. Many of the standard library functions use pointer accesses at some level deep within their implementations, and yet, most of the standard library is not `unsafe`. This is because its safe functions are checked abstractions over the unsafe details and are safe to use themselves.

By segregating safe and unsafe code in this manner, Rust is able to limit the scope in which memory-unsafety bugs can occur, enabling one to write programs which, by default, are memory-safe and free of undefined behavior. The C programmer, on the other hand, must be always mindful about whether his programs violate implicit, sometimes subtle rules.

## Debug vs. Release

How about integer overflow, or accessing an array out-of-bounds? Aren't these undefined behavior in C? How does Rust deal with them? It turns out that there is nothing preventing these pathological cases in the safe portion of Rust. Indeed, it would be wholly impractical to limit these operations in safe Rust due to how common they are. However, their consequences are different.

{% highlight rust linedivs %}
fn foo(x: i32) -> bool {
x+1 > x
}
{% endhighlight %}

Rust solves the integer overflow problem in a very elegant way. `rustc` provides two different modes for building Rust code: debug mode, and release mode. The first builds more quickly and contains more debugging information, and is ideal for testing during development, while the second is more heavily optimized and intended for production builds.

Debug mode compiles in run-time checks[^checks] for integer overflows on arithmetic operations as they happen, throwing a `panic` if they do. Release mode omits these checks, which incur a performance cost, instead [wrapping the result](https://huonw.github.io/blog/2016/04/myths-and-legends-about-integer-overflow-in-rust/) in a specified and deterministic way. The idea is that integer overflows should be caught during development and testing (panics are hard to ignore!) and if they do occur, the program panics, which is much better than if it continued to run with a compromised memory state.

[^checks]: Until now all the checks I've mentioned occur at compile-time, but Rust does also perform some run-time checks such as this one.

This strikes a good balance between correctness and performance. I believe this to have been a highly practical design decision, of the sort seldom seen in other languages. Certainly it is a better solution than undefined behavior, which can occur silently without one even being aware of it. Your program may even run fine until it is one day compiled with a different compiler or on a different architecture which handles the situation differently.

As for array out-of-bounds, there is nothing sensible the compiled code can do in release mode. Allowing these operations silently by providing access to memory outside the array would lead to memory safety issues. To avoid this, such accesses are always checked, despite the slight performance cost. Sidestepping these checks to gain more performance where it is critical is possible with unsafe code and direct memory access, in which case you are back to C's potential for undefined behavior, but only when it's actually necessary.

## Enums And The Pattern Matcher

I still cannot believe the number of languages today that do not feature a pattern matcher, especially newer languages like Go. Pattern matching provides tremendous benefit for relatively little cognitive cost for the programmer or complexity in the language.

Rust's pattern matcher has the additional benefit of being comprehensive, that is,

Rust is not breaking new ground with its pattern matcher. Haskell has featured one for a long time. But it's yet another thing that Rust does right which reduces the incidence of program error.

## Functional Programming

The embracing of functional programming paradigms by the Rust community is one thing I miss the most when I program in Go.

{% highlight go linedivs %}
for j := 0; j < len(dirs); j++ {
for i := 0; i < len(dirs[j].files); i++ {
file := dirs[j].files[i]
if len(file.Skylinks) == 0 {
// Remove the file.
dirs[j].files = append(dirs[j].files[:i], dirs[j].files[i+1:]...)
i--
}
}
}
{% endhighlight %}

The inner loop modifies the `files` slice we are iterating over, which is not allowed in Rust. Since `files` is an immutable reference that lives for the scope of the inner loop, we cannot also have a mutable reference for the duration of this scope. Instead, in Rust we have to adopt a functional style which actually turns out to be much more clear and less error-prone.

If Sia was instead written in Rust (a man can dream!) the code from above would look like this:

{% highlight rust linedivs %}
{% endhighlight %}

## Consistency

I would argue that consistency in a language and its standard library can be a significant language feature in itself. It is not a stretch to say that a consistent framework leads to less buggy code by way of less mental overhead and potential for error on the part of the programmer. Indeed, Rust is highly consistent, and unlike most other languages, has few design decisions that feel arbitrary or inelegant.

While not imposed by the compiler, there are accepted standards in the community for building APIs, such as predictable names for conversion methods, getting the length of a container, checking if a container is empty, and so on. For example, there is an idiom, adhered to in the compiler, standard library, and throughout the ecosystem, that all types you can get the length of should provide a _method_ `len`. `len` is provided on primitive types such as arrays as well as many, many user-defined types that you'll encounter.

Rust even provides a set of [API guidelines](https://rust-lang.github.io/api-guidelines/) which are sensible and practical, and the ecosystem by and large does a great job of adhering to them. There is also the highly useful [clippy](https://github.com/rust-lang/rust-clippy) tool that has a large number of lints which enforce idiomatic code.

## Ease Of Testing

## Dependency Management

Finally,

## Footnotes
