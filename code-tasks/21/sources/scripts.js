// в функцию ничего не передается
function run () {
    const birthYear = 1948;
    const thisYear = 1965;
    const firstName = "Иван";
    const lastName = "Петров";
    
    const greeting = "Привет! Меня зовут" + firstName + " " + lastName + " и мне " + (thisYear - birthYear) + " лет.";
    
    return greeting; // возвращаем приветствие.
}