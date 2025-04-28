module.exports.createToken = (number) =>{
    let charter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz12345678910"
    result=""
    for(let i = 0 ; i < number; i++){
        result += charter.charAt(Math.floor(Math.random() * charter.length))
    }
    return result;
}