//Dependencies
const XLSX       = require('xlsx');

//Constants
const inputFile   = process.argv[2];
const outputFile  = process.argv[3];
const classType   = {
    'T' : 'Tutorial',
    'L' : 'Lecture',
    'P' : 'Practical'
}
const days        = {
    'MON' : 'Monday',
    'TUES': 'Tuesday',
    'WED' : 'Wednesday',
    'THUR': 'Thursday',
    'FRI' : 'Friday',
    'SAT' : 'Saturday'
}
const mySubjects  = {
    'HS532'   : 'Planning and Economic Development',
    '16MA731' : 'Theory of Numbers',
    'CI511'   : 'Computer Networks',
    'CI514'   : 'Artificial Intelligence',
    'CI571'   : 'Computer Networks Lab',
    'CI574'   : 'Artificial Intelligence Lab',
    'CI575'   : 'Open Source Lab',
    'CI576'   : 'Information Security Lab'
}
const classes     = {
    'MON' :[],
    'TUES':[],
    'WED' :[],
    'THUR':[],
    'FRI' :[],
    'SAT' :[]
};

//Reading the file
console.log("Reading File: ",inputFile);

var workbook     = XLSX.readFile(inputFile);
var sheetName    = workbook.SheetNames[0];
var sheet        = workbook.Sheets[sheetName];

var keys = Object.keys(sheet).filter(key => key.match(/[A-Z][0-9]+/g));

keys.forEach(key => {
    var column        = key[0];
    var row     = key.slice(1);
    var value      = sheet[key].v;
    var myClass    = /([LPT])(.*[B][C]*)(.*[1][4].*)*(.[C].*)*([(])/g.exec(value);
    var whichClass = /([(]).*([)])/g.exec(value);
    var whereClass = /([-]).*([/])/g.exec(value);
    var teachers   = /([/]).*/g.exec(value);
    if(myClass){
        var subjectCode = whichClass[0].substring(1,whichClass[0].length-1)
        if(whichClass && mySubjects[subjectCode]){
            var day = getDayValue(row);
            pushDataToArray(day, myClass[1], mySubjects[subjectCode], whereClass, teachers[0].substring(1,teachers[0].length-1), sheet[column+'2'].v.split(" ")[0].split("-")[0]);
        }
        
    }
})
//Dumping Results into File
console.log("Writing Time Table to File: ",outputFile);
var response = JSON.stringify(classes);

//Functions
function getDayValue(row){
    try{
        return sheet['A'+row].v;
    } catch{
        return getDayValue(row-1);
    }
}
function pushDataToArray(day, type, subject, venue, teachers, time){
    venue = venue[0].split("-").slice(-1);
    venue = venue[0].substring(0,venue[0].length-1);
    classes[day].push({
        day      :days[day],
        type     :classType[type],
        start    :time,
        subject  :subject,
        venue    :venue,
        teachers :teachers.split(",")
    })
}

module.exports = {
    classes
}