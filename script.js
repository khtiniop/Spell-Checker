//CONFIG --- start
const GAP = 2;
//config end ---
//vowels ? - start---
function isVowel(c) {
    return "aeiouAEIOU".includes(c);
}
//vowels end --- 

// subsitution cost stuff ---- ben 
function subCost(a, b) {
    if (a === b) return 0;
    const av = isVowel(a);
    const bv = isVowel(b);

    //vowel-vowel OR consonant-consonant
    if ((av && bv) || (!av && !bv)) return 1;

    //vowel-consonant mismatch
    return 3;
}
// substitution end --- ben 



//align score ---- start
function alignmentScore(s, t) {
    const n = s.length;
    const m = t.length;
    const dp = Array.from({length: n + 1 },() => Array(m + 1).fill(0));
    for (let i = 1;i <= n;i++) dp[i][0] = i * GAP;
    for (let j = 1;j <= m;j++) dp[0][j] = j * GAP;
    for (let i = 1;i <= n;i++) {
        for (let j = 1; j <= m; j++) {
            const costSub = dp[i - 1][j - 1] + subCost(s[i - 1], t[j - 1]);
            const costDel = dp[i - 1][j] + GAP;
            const costIns = dp[i][j - 1] + GAP;
            dp[i][j] = Math.min(costSub, costDel, costIns);
        }
    }

    return dp[n][m];
}
//align score end ---- 


//loading the dictionary ---- start
let dictionary = [];

async function loadDictionary() {
    const res = await fetch("dictionary.txt");
    const text = await res.text();
    dictionary = text
        .split(/\s+/)
        .map(w => w.trim())
        .filter(w => w.length > 0);
    //enable button after loading
    document.getElementById("checkBtn").disabled = false;
}

loadDictionary();
//loading dictionary end


//top ten suggestoins
function getSuggestions(word) {
    word = word.toLowerCase(); //making capitalization not matter :) 
    const scored = dictionary.map(dictWord => ({
        word: dictWord, score: alignmentScore(word, dictWord.toLowerCase())
    }));
    scored.sort((a, b) => a.score - b.score); //sort words by alignment score 
    return scored.slice(0, 10);
}
//top ten suggestions end---


//UI stuff start -- 
document.getElementById("checkBtn").onclick = () => {
    const input = document.getElementById("wordInput").value.trim();
    const results = getSuggestions(input);
    const list = document.getElementById("suggestions");
    list.innerHTML = "";
    results.forEach(r => {
        const li = document.createElement("li");
        li.textContent = `${r.word} (score: ${r.score})`;
        list.appendChild(li);
    });
};
//UI end --- 
