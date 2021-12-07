var formula = document.querySelector("#formula")
var btn_verificar = document.createElement("input")
var divResul = document.querySelector("#resul")

btn_verificar.setAttribute("type", "submit")
btn_verificar.setAttribute("id", "btnVerificar")
btn_verificar.setAttribute("value", "Verificar")

divResul.style.display = "none"

document.querySelector("#formulario").append(btn_verificar)

var valoracaoSatisfaz = []

function contaLiterais(valoresClausula) {
    cont = 0
    for (var i = 0; i < valoresClausula.length; i++)
        cont++

    return cont
}

function contemBottom(C) {
    for (var i = 0; i < C.length; i++) {
        if (C[i].indexOf("") != -1) return true
    }

    return false
}

function HORNSAT(C) {

    if (contemBottom(C)) return false // Verifica se ⊥ ∈ C

    var valoracao = []
    var aux = []

    for (var i = 0; i < C.length; i++) {
        for (var j = 0; j < C[i].length; j++) {
            C[i][j][0] == "-" ? aux.push(1) : aux.push(0)
            valoracaoSatisfaz.push([C[i][j], aux[j]])
        }

        valoracao.push(aux)
        aux = []
    }

    var temFato = false
    var fatoEscolhido = ""

    for (var i = 0; i < valoracao.length; i++)
        if (valoracao[i].length == 1 && valoracao[i].indexOf(0) != -1) {
            temFato = true
            fatoEscolhido = C[i][valoracao[i].indexOf(0)]
            break
        }

    if (!temFato) return true // Verifica se não tem fatos

    var Cl = []
    var aux = []
    for (var i = 0; i < C.length; i++) {
        for (var j = 0; j < C[i].length; j++) {
            if (C[i][j] == fatoEscolhido) {
                aux = []
                break
            }
            if (C[i][j].indexOf(fatoEscolhido) == -1)
                aux.push(C[i][j])
            else {//se tiver a forna negada do fato
                if (contaLiterais(valoracao[i]) == 1)//Se tiver só um literal
                    aux.push("")
            }
        }
        if (aux.length > 0)
            Cl.push(aux)
        aux = []
    }

    console.log(Cl)
    return HORNSAT(Cl)
}

//Quando clica no botão "Verificar"
btn_verificar.onclick = function () {

    var clausulas = formula.value.split("\n") // Separa as clausulas
    var C = []

    for (var i = 0; i < clausulas.length; i++) {
        C.push(clausulas[i].split(" "))
    }

    if (HORNSAT(C)) {
        divResul.style.display = "block"
        divResul.style.backgroundColor = "#99ffa6"
        divResul.style.padding = "10px 3px 10px 5px"

        var montarValoracao = "<b>Valoração que satisfaz:</b>"
        for (i = 0; i < valoracaoSatisfaz.length; i++) {
            if (montarValoracao.indexOf(valoracaoSatisfaz[i][0]) == -1 && valoracaoSatisfaz[i][1] == 1)
                montarValoracao += "<dd>• v(" + valoracaoSatisfaz[i][0] + ") = " + valoracaoSatisfaz[i][1] + ";</dd>"
        }
        document.querySelector("#resultado").innerHTML = "É satisfazı́vel.<dl>" + montarValoracao + "</dl>"
        valoracaoSatisfaz = []
        montarValoracao = ""
    }
    else {
        divResul.style.padding = "10px 3px 10px 5px"
        divResul.style.display = "block";
        if (formula.value == "") {
            divResul.style.backgroundColor = "	#EEE8AA"
            document.querySelector("#resultado").innerHTML = "Insira a fórmula."
        } else {
            divResul.style.backgroundColor = "#ffa8a8"
            document.querySelector("#resultado").innerHTML = "Fórmula insatisfazı́vel."
        }
    }

}