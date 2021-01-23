let story = 'Last weekend, I took literally the most beautiful bike ride of my life. The route is called "The 9W to Nyack" and it actually stretches all the way from Riverside Park in Manhattan to South Nyack, New Jersey. It\'s really an adventure from beginning to end! It is a 48 mile loop and it basically took me an entire day. I stopped at Riverbank State Park to take some extremely artsy photos. It was a short stop, though, because I had a really long way left to go. After a quick photo op at the very popular Little Red Lighthouse, I began my trek across the George Washington Bridge into New Jersey.  The GW is actually very long - 4,760 feet! I was already very tired by the time I got to the other side.  An hour later, I reached Greenbrook Nature Sanctuary, an extremely beautiful park along the coast of the Hudson.  Something that was very surprising to me was that near the end of the route you actually cross back into New York! At this point, you are very close to the end.';

let overusedWords = ['really', 'very', 'basically'];

let unnecessaryWords = ['extremely', 'literally', 'actually' ];

//function to determine whether a word is uneccesary
let necessaryWord = word => (!unnecessaryWords.includes(word));

//put the story words into an array
let storyWords = story.split(" ");

//filter out the uneccesary words from the story words
let betterWords = storyWords.filter(necessaryWord);

//count the number of overused words in the story words
let countOverusedWords = 0;
storyWords.forEach(word => {
    if (overusedWords.includes(word)){countOverusedWords++;}
  }
)

//count the number of sentences by counting the number of words ending in . or !
let countSentences = 0;
storyWords.forEach(word => {
    if (word[word.length-1]==='!' || word[word.length-1]==='.'){
      countSentences++;}
  }
)

//define synonyms for overused words
const synonyms = {
  really: ['actually', 'truly', 'honestly', 'genuinely', 'undoubtedly'],
  very: ['tremendously', 'vastly', 'hugely', 'extremely', 'exceedingly', 'overly'],
  basically: ['fundamentally', 'essentially', 'predominantly','firstly']
}

//retrieve a random synonym for the overused word
let getSynonym = (overusedWord) => synonyms[overusedWord][Math.floor(Math.random()*synonyms[overusedWord].length)];

//replace each overused word with a random synonym
for (let i=0; i<betterWords.length; i++) {
  if (overusedWords.includes(betterWords[i])){
    betterWords[i] = getSynonym(betterWords[i]);
    let vowels = ['a','e','i','o','u'];
    //if the new word starts with a vowel and is preceeded by 'a', replace it with 'an'
    if (vowels.includes(betterWords[i][0]) && betterWords[i-1] === 'a'){
      betterWords[i-1] = 'an';
    }
  }
}
console.log(betterWords.join(' '));





