1) What is the difference between var, let, and const?
Ans:
var → Function-scoped or globally-scoped, can be re-declared and updated, prone to hoisting issues.

let → Block-scoped, can be updated but cannot be re-declared in the same scope.

const → Block-scoped, cannot be updated or re-declared (value stays constant), but objects/arrays declared with const can have their contents modified.

2) What is the difference between map(), forEach(), and filter()?
Ans: 
map() → Returns a new array with the results of applying a function to each element.

forEach() → Executes a function on each element but does not return a new array (returns undefined).

filter() → Returns a new array containing only elements that satisfy a condition.

3) What are arrow functions in ES6?
Ans:Arrow functions are a shorter syntax for writing functions using =>.

They do not bind their own this (they inherit this from the surrounding context).

4) How does destructuring assignment work in ES6?
Ans:Destructuring lets you extract values from arrays or objects into variables in a single step.

Array example:

const [x, y] = [10, 20];  // x=10, y=20

5) Explain template literals in ES6. How are they different from string concatenation?
Ans: Template literals use backticks (`) instead of quotes.

They allow string interpolation using ${expression}.

They support multi-line strings without needing \n.

Example with concatenation: "Hello " + name + ", you are " + age + " years old."

Example with template literals: `Hello ${name}, you are ${age} years old.`

