## Use GitHub pages to deploy our web app



### Reasons:


- Automatic deployment



### Outcomes:

- (+) Update whenever we push to main
- (+) Easy to use, no other accounts needed

- (-) The cost of adding a 'gh-pages -d source' to our CI pipeline is worth considering: this would require installing the tool each time, running the tool which does a large amount of file read/write (through copying the source folder), and then pushing a new branch. And this would all happen every push theoretically.
- (-) gh-pages could have merge conflicts? It seems as if this branch is currently both ahead and behind main, so running the gh-pages command right now would either a) create merge conflicts that would need to be manually resolved or b) obliterate any changes on that branch in favor of main



Date of Decision: 03/01/21