<summary dir=rtl align=center><summary dir=ltr /><h1>leftPadDeez</h1></summary>
<img align=center src=https://user-images.githubusercontent.com/31113245/235832123-4a107f5b-b66a-49a8-a679-e4334e38b512.png />
<p align=center>nuts</p>

### Introduction
getting rolled
* https://twitter.com/ThePrimeagen/status/1653154841668071424
* https://twitter.com/ExplainThisBob/status/1653159653365399552
  - underwhelming is funny

then it started to happen
first ember - https://twitter.com/EmberHext/status/1653096327675346945
  - it hurt, but it was true

then trav - https://twitter.com/techsavvytravvy/status/1653672117081108483
  - crab language man
  - https://twitter.com/techsavvytravvy/status/1653672117081108483

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

"can we get a quick expla"
https://www.youtube.com/watch?v=NmHUjxKpD90&lc=UgzJ2XxM49kN4S9f5FV4AaABAg

"sure"

Also, big shoutout to stack overflow for creating the worst performing version
by over 10x
https://stackoverflow.com/questions/13859538/simplest-inline-method-to-left-pad-a-string/13861999

---

### The Problem
so is travvy's implementation really 308x faster?  Why is my version i wrote
later 6.15x faster than travvy's?  Can you trust these benchmarks?  Is there a
better way to measure?  Is stackoverflow really a place to make you feel
morally defeated or superior depending on whether you ask or answer a question?

https://stackoverflow.com/questions/2766785/fixing-lock-wait-timeout-exceeded-try-restarting-transaction-for-a-stuck-my/4797328#4797328
bruh
also accepted? little bobby tables would be so impressed

These types of benchmarks are referred to as micro benchmarks.
1. they are often ran on "someone's computer."  Its not a great testing
   environment

   pgrep node
   pgrep rust-analyzer
   pgrep zls

2. the duration of the tests often hide implementation details that can be bad,
   ie, GC.  the usage can often hide implementation details.  for strings,
   concating them creates roped strings which are quite optimized, but when you
   use them, you can pay a higher tax.  thus my 2.5 worse solution, becomes
   quite comparable (show image)

leftPad 100 100 0.21621200442314148
leftPad 100 1000 0.7008289992809296
leftPad 100 10000 5.991432994604111
leftPad 1000 100 0.4008829891681671
leftPad 1000 1000 6.121386021375656
leftPad 1000 10000 46.95431199669838
leftPad 10000 100 4.497440010309219
leftPad 10000 1000 41.7287720143795
leftPad 10000 10000 439.4574239850044

primeOriginalLeftPad 100 100 0.12118202447891235
primeOriginalLeftPad 100 1000 1.232912003993988
primeOriginalLeftPad 100 10000 5.655689001083374
primeOriginalLeftPad 1000 100 0.6178660094738007
primeOriginalLeftPad 1000 1000 4.725012987852097
primeOriginalLeftPad 1000 10000 47.17180600762367
primeOriginalLeftPad 10000 100 7.3008719980716705
primeOriginalLeftPad 10000 1000 44.14427199959755
primeOriginalLeftPad 10000 10000 459.34809198975563

3. if you run them enough, you can make a faster version slower than the slower
   version.  So.. you can just lie (if needed)  This is because the margin of
   error is large

btw, get rekt
leftPad 10000 10000 416.804378002882
leftpadTravvy 10000 10000 1.3511539995670319
stringSpecialCase 10000 10000 0.21970000863075256

### The Experiment
So how did i determine what leftpad was ackshually the fastest?

1. create a server
  - go a head, complain about it in the comments
2. setup apache bench script and ensure a proper sleep between each and manual
   gc execution on the server if no requests (previous tests wont have as much
   initial effect)
3. send 27 million requests that took 36 hours to complete.
  - i would personally like to thank linode for not rate limiting me and giving me an instance to test on :)  Thanks Andrew
4. create a parser of apache bench results and calculate the average of the medians
5. paste everything in google spreadsheets
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
