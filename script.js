// element references
const form = document.getElementsByClassName('form')[0]
const dayInput = document.getElementById("day")
const monthInput = document.getElementById("month")
const yearInput = document.getElementById("year")
const dayInputParent = dayInput.parentElement
const monthInputParent = monthInput.parentElement
const yearInputParent = yearInput.parentElement
const dayResult = document.getElementById("day-result")
const monthResult = document.getElementById("month-result")
const yearResult = document.getElementById("year-result")
const cardContainer = document.getElementsByClassName("card-container")[0]


/* ---------------------------------------------------- */
// error states
let isDayErrorActive = false
let isMonthErrorActive = false
let isYearErrorActive = false
/* ---------------------------------------------------- */

console.log("new build deployed")

// Trying Map class instead of objects or arrays😅 
const months = new Map()
months.set(1, "January")
months.set(2, "February")
months.set(3, "March")
months.set(4, "April")
months.set(5, "May")
months.set(6, "June")
months.set(7, "July")
months.set(8, "August")
months.set(9, "September")
months.set(10, "October")
months.set(11, "November")
months.set(12, "December")

/* ---------------------------------------------------- */
// These listeners are to prevent extra unnecessary inputs from user

dayInput.addEventListener('keydown', handelKeyPress)
monthInput.addEventListener('keydown', handelKeyPress)
yearInput.addEventListener('keydown', handelKeyPress)

/* ---------------------------------------------------- */
// Handling submit event
form.addEventListener('submit', handelSubmit)


/* ---------------------------------------------------- */
// function implementations







/* ---------------------------------------------------- */
// Event handler functions
function handelKeyPress(evt) {
    // Function to prevent user from unnecessary adding input and to remove
 validator error message if present
console.log("event triggered")
    if (!isCharNumber(evt.key)) {
        evt.preventDefault()
    }
    if ((evt.target === yearInput && evt.target.value.length === 4)) {
        // checking if current target element object has reference to 'yearInput' element 
        evt.preventDefault()
    }
    if (evt.target.value.length === 2 && evt.target !== yearInput) {
        // Similar to above if condition
        evt.preventDefault()
    }
    cleanErrorMessage()

}

function handelSubmit(evt) {
    evt.preventDefault()
    cleanErrorMessage()
    setResult() // set result to default dummy text
    const toggleError = {
        day: () => {
            toggleErrorValidatorStyle("day")
        },
        month: () => {
            toggleErrorValidatorStyle("month")
        },
        year: () => {
            toggleErrorValidatorStyle("year")
        }
    }
    const day = parseInt(dayInput.value)
    const month = parseInt(monthInput.value)
    const year = parseInt(yearInput.value)

    if([day, month, year].some(item=>isNaN(item))){
        // if fields are empty from user
        if(isNaN(day)) toggleErrorValidatorStyle("day")
        if(isNaN(month)) toggleErrorValidatorStyle("month")
        if(isNaN(year)) toggleErrorValidatorStyle("year")
        return
    }
    
    const validDate = checkDate(day, month, year)
    if (!validDate.isValid) {
        generateErrorMessage(validDate.message)
        validDate.errorField.forEach(field=>{
            toggleError[field]()
        })
        return
    }
     const {days, months, years}= calculateAge(day, month, year)
     setResult(days, months, years)


}



/* ---------------------------------------------------- */
// Helper functions




function argumentError(message = "Something went wrong") {
    // Function which returns custom error object 
    const argumentError = new Error()
    argumentError.name = "ArgumentError"
    argumentError.message = message
    return argumentError
}


function isLeapYear(year) {
    // logic to check leap year
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}


function calculateAge(day, month, year) {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed
    let currentDay = currentDate.getDate();
  
    let ageYears = currentYear - year;
    let ageMonths = currentMonth - month;
    let ageDays = currentDay - day;
  
    if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0)) {
      ageYears--;
      ageMonths += ageMonths < 0 ? 12 : 0;
    }
  
    if (ageDays < 0) {
      let daysInLastMonth = new Date(currentYear, currentMonth - 1, 0).getDate();
      if (currentMonth === 2 && isLeapYear(currentYear) && day > 29) {
        daysInLastMonth = 29;
      }
      ageMonths--;
      ageDays += daysInLastMonth;
    }
  
    return { years: ageYears, months: ageMonths, days: ageDays };
  }

function checkDate(day, month, year) {
    // validation function
    // returns an object based on date is valid or not, takes number as argument only
    // This function is a  mess 😅
    if ([day, month, year].some(item => typeof item !== 'number')) {
        throw argumentError('Can take only number values')
    }
    const validDate = {
        isValid: false,
        message: "",
        errorField: []
    }
    const {errorField} = validDate
    if(day<=0){   
        errorField.push("day")
    }
    // Check for invalid month values
    if (month <= 0 || month > 12) {
        errorField.push("month")
    }
    // February is an exception
    if (month === 2) {
        // Check for leap year and handle February days accordingly
        const maxDays = isLeapYear(year) ? 29 : 28
        if (day > maxDays) {
            validDate.message = `February cannot have ${day} days in year ${year}`
            errorField.push("day")
            return validDate
        }
    } else {
        // Check for month having 31 days
        const monthsHaving31Days = [1,3,5,7,8,10,12]
        const maxDays = monthsHaving31Days.includes(month)  ? 31 : 30
        if (day > maxDays) {
            validDate.message = `${months.get(month)|| ''} cannot have ${day} days`
            errorField.push("day")
            return validDate
        }
    }

    // Check for invalid day value (day cannot be zero)
    if (day <= 0) {
        validDate.message = "Invalid day"
        errorField.push("day")
    }

    validDate.isValid = validDate.errorField.length === 0
    validDate.message = validDate.isValid ? "Valid date" : "Invalid date"
    return validDate
}


function isCharNumber(char) {
    // returns true if argument character is number
    return !isNaN(parseInt(char[0]))
}

/* ---------------------------------------------------- */
// custom styling and dom manipulation functions
//  RUN BELOW FUNCTIONS IN BROWSER CONSOLE AND SEE CHANGES 😀

function generateErrorMessage(msg) {
    cardContainer.insertAdjacentHTML(
        'afterbegin',
        `<span class="error-message">${msg}</span>`
    )
}


function toggleErrorValidatorStyle(timeElement) {
    // toggles error validator style, sets corresponding error states to boolean based on style is active or not
    // It takes only "day", "month" or "year"  as string arguments only
    // Run the function in console to understand it better
    if (!(timeElement === "day" || timeElement === "month" || timeElement === "year")) {
        throw argumentError(`Can take only string value 'day' or 'month' or 'year' , instead passed '${timeElement}'`)
    }
    // refer style.css from 124th line to know about 'error-active' class 
    switch (timeElement) {
        case "day":
            dayInputParent.classList.toggle("error-active")
            isDayErrorActive = dayInputParent.classList.contains("error-active")
            return

        case "month":
            monthInputParent.classList.toggle("error-active")
            isMonthErrorActive = monthInputParent.classList.contains("error-active")
            return

        case "year":
            yearInputParent.classList.toggle("error-active")
            isYearErrorActive = yearInputParent.classList.contains("error-active")
            return
    }

}


function cleanErrorMessage(){
    // removes error styles and messages. 
    if (isDayErrorActive) {
        isDayErrorActive = toggleErrorValidatorStyle("day")
    }

    if (isMonthErrorActive) {
        isDayErrorActive = toggleErrorValidatorStyle("month")
    }

    if (isYearErrorActive) {
        isYearErrorActive = toggleErrorValidatorStyle("year")
    }

    document.getElementsByClassName('error-message')[0]?.remove()
}

function setResult(day, month, year) {
    if ([day, month, year].some(item => !(typeof item === 'undefined' || typeof item === 'number'))) {
        throw argumentError('Can take only number values')
    }
    dayResult.children[0].textContent = day || "--"
    dayResult.children[1].textContent = (day === 1) ? 'day' : 'days'

    monthResult.children[0].textContent = month || "--"
    monthResult.children[1].textContent = (month === 1) ? 'month' : 'months'

    yearResult.children[0].textContent = year || "--"
    yearResult.children[1].textContent = (year === 1) ? 'year' : 'years'

}