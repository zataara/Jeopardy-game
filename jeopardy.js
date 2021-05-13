// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
const GAMEBUTTON = $('#newgame')
let categories = [];
const numCat= 6;
const numClue = 5;
/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

 
async function getCategoryIds() {
    let response = await axios.get(`http://www.jservice.io/api/categories?count=100`);
    //// console.log(response)
    let IDs = response.data.map(function(result) {
        return result.id
    })
    ////console.log(IDs)
    let randomIDs = _.sampleSize(IDs, numCat)
    
    /////console.log(randomIDs)
    //// console.log(randomIndex())
    return randomIDs;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catID) {
    const response = await axios.get(`http://www.jservice.io/api/category?id=${catID}`)
    //// console.log(response);
    let category = response.data;
    let CLUES = category.clues;
    let usedClues = _.sampleSize(CLUES, numClue);
    let clues = usedClues.map(function(clue){
        return {question: clue.question,
                answer: clue.answer,
                showing: null
    }})    
    //// console.log(clues)
    return {title: category.title, clues}
    ////console.log(usedClues)

}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    let tableRow = $("<tr>");
    for (let i = 0; i < numCat; i++) {
        tableRow.append($("<th>").text(categories[i].title));
    }
    $("#titlerow").append(tableRow);
    for (let j = 0; j < numClue; j++) {
      let tableRow = $("<tr>");
      for (let k = 0; k < numCat; k++) {
        tableRow.append($("<td>").attr("id", `${k}-${j}`).text("?"));
      }
      $("#cluesmatrix").append(tableRow);
    }
  }


/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    const id = evt.target.id;
    let [categoryID, clueID] = id.split('-');
    let clue = categories[categoryID].clues[clueID];

    let clueText;
    if (clue.showing = false) {
        clueText = clue.question;
        clue.showing = 'showing question';
    } else if(clue.showing === 'showing question'){
        clueText = clue.answer;
        clue.showing = 'showing answer';
    } else {
        return;
    }
    $(`#${categoryID}-${clueID}`).html(clueText)
}



/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    $('#gamematrix').empty();
    $('#newgame').html('Restart')

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function beginGame() {
    showLoadingView()
    let IDs = await getCategoryIds();
    for(let ID of IDs) {
        categories.push(await getCategory(ID));
    }
    hideLoadingView()
    fillTable();
}

/** On click of start / restart button, set up game. */
GAMEBUTTON.on('click', beginGame);



/** On page load, add event handler for clicking clues */
function eventListener() {
    $('#gamematrix').on('click', 'td', handleClick);
}