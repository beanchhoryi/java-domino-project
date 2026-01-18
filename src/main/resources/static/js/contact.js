function copyNumber(Number){
    var elem = document.createElement("textarea");
    elem.value = Number;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
}
function copy(){
    const copyNumber = document.getElementById("copied");
    copyNumber.classList.add("visible");
    setTimeout(() => {
        copyNumber.classList.remove("visible");
    }, 2000)
}