// ==================Anagrams =========================================

// our array of words
// const inputs = ['see', 'tea', 'eat', 'sear', 'ears', 'ate'];

// function generateAnagrams(input) {
//   // if (!input) {
//   //     return;
//   // }
//   input = input.split('');
//   input = input.sort();
//   input = input.join('');
//   return input;
// }


// // main function
// function grouper(inputs) {
//   let anagrams = {};
//   inputs.forEach((input) => {
//     let newWord = generateAnagrams(input);
//     if (anagrams[newWord]) {
//       return anagrams[newWord].push(input);
//     }
//     anagrams[newWord] = [input];
//   });
//   return anagrams;
// }

// const myAnagrams = grouper(inputs);
// console.log(myAnagrams)

// for (const sortedWord in myAnagrams) {
//   console.log(myAnagrams[sortedWord].toString());
// }

// ================== *******Anagrams*********** =========================================

// --------------unique no from array -------------

// const years = [2016, 2017, 2016, 2015, 2018, 2018, 2019, 2021];
// const u = new Set(years);
// const sorted = years.sort((a, b) => { return b - a });
// console.log(sorted);
// console.log(u)

// const uniqueYears = [...new Set(years)];
// console.log(uniqueYears);

//=============================unique value array objects======================

// const array = [
//   { id: 3, name: 'Central Microscopy', fiscalYear: 2018 },
//   { id: 5, name: 'Crystallography Facility', fiscalYear: 2018 },
//   { id: 3, name: 'Central Microscopy', fiscalYear: 2017 },
//   { id: 5, name: 'Crystallography Facility', fiscalYear: 2017 }
// ];

// const result = [];
// const map = new Map();

// for (const item of array) {
//   if (!map.has(item.id)) {
//     map.set(item.id, true);
//     result.push({ id: item.id, name: item.name });
//   }
// }

// console.log(result)

//=======================

// const arrayOfNumbers = [2, 5, 3, 4];
// arrayOfNumbers.reduce((prevValue, currentValue, index, array) => {
//   console.log(prevValue, currentValue, index, array);
//   array[index-1] = array[index-1] * 2;
// })

// console.log(arrayOfNumbers);


//===============================Question 1==========================

//Find unique numbers
//Input: 2, 3, 4, 3, 3, 2, 4, 9, 1, 2, 5, 5
//Output: 9,1

let myArray = [2, 3, 4, 3, 3, 2, 4, 9, 1, 2, 5, 5,8,7,0];

// let unique = new Set(array);
// let uniqueValues = [...unique];
// console.log(uniqueValues);

let uniqueValues1 = myArray.filter((value, index) => myArray.indexOf(value) === myArray.lastIndexOf(value));
console.log(uniqueValues1);


//===================Question 2====================================

// Find anagrams of each word in list
// Input: ["see", "tea", "eat", "sear", "ears", "ate"]
// Output: {"see": null, "tea":["eat", "ate"], "eat":["tea", "ate"], "ate":["eat", "tea"], "sear":["ears"], "ears":["sear"]}
// Anagrams means words having all the letters same, e.g., "sit" and "ist" are anagrams but "sit" and "sat" are not anagrams.

let inputArray = ["see", "tea", "eat", "sear", "ears", "ate"];
var allAnagrams = {};

const findAnagrams = (inputData) => {

  inputData.forEach(element => {
    let word = element.split('').sort().join('');

    if (allAnagrams[word] == true) {
      return allAnagrams[word].push(element);
    }
    allAnagrams[word] = element;

  });

  return allAnagrams;
}

// let result = findAnagrams(inputArray);
// console.log(result);

// ================Question 3 ====================================

// Matching balanced parenthesis, every open parenthesis should be closed correctly.
// Input string {[(({[{{}}]}))]} returns true
// Input string {[[())]} returns false

//let inputString = "{[(({[{{}}]}))]}";
let inputString = "{[[())]}";

const balancedParenthesis = (inputString) => {
  let isBalanced = false;

  let arrayStack = [];
  for (let parenthesis of inputString) {
    let parenthesisIndex = inputString.indexOf(parenthesis);
    if (parenthesisIndex === -1) {
      continue;
    }

    if (parenthesisIndex % 2 === 0) {
      arrayStack.push(parenthesisIndex + 1);
      isBalanced = true;
      console.log(arrayStack);
      return isBalanced;
    }
    else {
      if (arrayStack.pop() !== parenthesisIndex) {
        isBalanced = false;
        return isBalanced;;
      }
    }
  }
  if (arrayStack.length === 0) {
    isBalanced = false;
    return isBalanced;
  }
}

console.log(balancedParenthesis(inputString));

