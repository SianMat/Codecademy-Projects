const _ = {
    clamp(num, lower, upper) {
        num = Math.max(num,lower);
        num = Math.min(num, upper);
        return num;
    },

    inRange(num, start, end) {
        if (!end) {
            end = start;
            start = 0;
        }
        if (end < start){
            let temp = start;
            start = end;
            end = temp;
        }
        if (num >= start && num < end){
            return true;
        }
        return false;
    },

    words(str) {
        let word = "";
        let words = [];
        for (let i=0; i<str.length; i++){
            if (str[i] === ' '){
                words.push(word);
                word = "";
            }
            else {
                word+=str[i];
            }   
        }
        words.push(word);
        return words;
    },

    pad(str,length) {
        let currentLength = str.length;
        while(currentLength < length){
            if ((currentLength - length)%2 === 0){
                str = " " + str;
            }
            else {
                str = str + " ";
            }
            currentLength++;
        }
        return str;
    },

    has(object, key) {
        let val = object[key];
        console.log(val);
        if(val === undefined){return false;}
        else {return true;}
    },

    invert(object) {
        let newObject = {};
        for (let key in object){
            newObject[object[key]] = key;
        }
        return newObject;
    },

    findKey(object, predicate) {
        for (let key in object){
            if(predicate(object[key])){return key;}
        }
        return undefined;
    },

    drop(arr, number) {
        if (!number){number = 1;}
        arr = arr.slice(number);
        return arr;
    },

    dropWhile(arr, predicate) {
        let dropNumber = arr.findIndex((element, index) => !predicate(element, index, arr));
        let newArray = this.drop(arr,dropNumber);
        return newArray;
    },

    chunk(arr, size) {
        if (!size){size = 1;}
        let chunks = [];
        for(let start = 0; start < arr.length; start+=size){
            let end = start + size;
            let temp = arr.slice(start,end);
            chunks.push(temp);
        }
        return chunks;
    }

};




// Do not write or modify code below this line.
module.exports = _;