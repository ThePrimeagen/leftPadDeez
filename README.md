<summary dir=ltr ><summary align=center dir=rtl /><h1>leftPadDeez</h1></summary>
<p align=center ><img src=https://user-images.githubusercontent.com/31113245/235832123-4a107f5b-b66a-49a8-a679-e4334e38b512.png /> </p>
<p align=center>nuts</p>

### Introduction
leftPad, an 11 line piece of code that broke the internet turns out had a
second incident... and it involves me... ... getting rolled

https://qz.com/646467/how-one-programmer-broke-the-internet-by-deleting-a-tiny-piece-of-code

So... maybe i made a mistake where i accidentally code a "faster" of leftpad
live where the results... were not faster...

https://www.youtube.com/watch?v=NmHUjxKpD90

ooffff you hate to see it

this inspired memes...
* https://twitter.com/ThePrimeagen/status/1653154841668071424

then it started to happen
first ember - https://twitter.com/EmberHext/status/1653096327675346945
  - it hurt, but it was true

then trav - https://twitter.com/techsavvytravvy/status/1653672117081108483

then others
https://twitter.com/ESArnau/status/1653151823274942472

then the competition
  - https://twitter.com/EmberHext/status/1653778878572253186
  - submissions, and more
        https://twitter.com/eloytoro/status/1653871587605585932
        https://twitter.com/brplcc/status/1656067270265937920


meanwhile, yt comments be making me hate my life
https://www.youtube.com/watch?v=NmHUjxKpD90&lc=UgylN8xDB2Khj2tAQuh4AaABAg
https://www.youtube.com/watch?v=NmHUjxKpD90&lc=Ugyi9PjnRJsivUaFPFp4AaABAg
https://www.youtube.com/watch?v=NmHUjxKpD90&lc=UgwR3rE1Le0tVX9f1CZ4AaABAg
https://www.youtube.com/watch?v=NmHUjxKpD90&lc=UgwGXW6e7gnGjFil83x4AaABAg
https://www.youtube.com/watch?v=NmHUjxKpD90&lc=UgxJNpNsbxkNu51Ddbd4AaABAg
https://www.youtube.com/watch?v=NmHUjxKpD90&lc=UgwKTOwbaCVmulmtrg54AaABAg
https://www.youtube.com/watch?v=NmHUjxKpD90&lc=Ugw3Q93RlC53tRZP7k14AaABAg
https://www.youtube.com/watch?v=NmHUjxKpD90&lc=Ugzvq2RLLE5W8iKPzGR4AaABAg

Even stack overflow had their own bespoke solution... and it didn't even take
advantage of tail recursion... rook

https://stackoverflow.com/questions/13859538/simplest-inline-method-to-left-pad-a-string/13861999

---

### The Problem
So this all started due to something called microbenchmarks.
- show what a microbenchmark is

Now the primary feature of a micro benchmark is that they lie to you

#### Run the benchmarks...
So is travvy's solution over 100x faster than the original leftpad?
Was my live solution solution 50% slower than the original leftpad?
Is my specialCase solution the SAME speed as the native implementation provided by padLeft?

But why do they lie to you?

1. they are often ran on "someone's computer."  Its not a great testing
   environment

   pgrep node
   pgrep rust-analyzer
   pgrep zls

   * ladies and arch users, calm down *

2. not only that, but i am on a laptop... powermanagement?

3. the duration of the tests often hide implementation details, ie GC

4. usage makes a difference...
- what a string usually is
- rope https://en.wikipedia.org/wiki/Rope_(data_structure)
- consequence of rope

### The Experiment
So how did i determine what leftpad was ackshually the fastest?

1. create a server
  - go a head, complain about it in the comments
2. setup apache bench script and ensure a proper sleep between each and manual
   gc execution on the server if no requests (previous tests wont have as much
   initial effect)
3. send 50 million requests that took 36 hours to complete.
  - i would personally like to thank linode for not rate limiting me and giving me an instance to test on :)  Thanks Andrew
4. create a parser to parse apache bench results and calculate the average of the medians
5. import results into google spreadsheets
6. charts

### The Conclusion
What is each data point? Each data point represents 75k requests.  The value is
the average of the median value of 25k requests.

First, what do these charts mean? (go over axes)
Second, which _was the fastest_?
Third, What is our conclusion?

if my code is slower than so
"don't look at me, i am ugly"
"i guess its time to go back to python (or php)"
