var formula = document.querySelector("#formula")
var btn_verificar = document.createElement("input")
var divResul = document.querySelector("#resul")

btn_verificar.setAttribute("type", "submit")
btn_verificar.setAttribute("id", "btnVerificar")
btn_verificar.setAttribute("value", "Verificar")

divResul.style.display = "none"

document.querySelector("#formulario").append(btn_verificar)

var valoracaoSatisfaz = []

function defineValores(C) {
    var valoracao = []
    var aux = []

    for (var i = 0; i < C.length; i++) {
        if (C[i].length == 0) return false
        if (C[i].indexOf("") != -1) return false // Verifica se tem literais vazios
        for (var j = 0; j < C[i].length; j++) {
            C[i][j][0] == "-" ? aux.push(0) : aux.push(1)
            valoracaoSatisfaz.push([C[i][j], aux[j]])
        }

        valoracao.push(aux)
        aux = []
    }
    return valoracao
}

function contaLiterais(valoresClausula) {
    cont = 0
    for (var i = 0; i < valoresClausula.length; i++)
        cont++

    return cont
}

function clausulaUnitaria(valoresClausula) {
    indiceClausula = -1
    for (var i = 0; i < valoresClausula.length; i++)
        if (contaLiterais(valoresClausula[i]) == 1) {
            indiceClausula = i
            break
        }

    return indiceClausula
}

function removeClausulaLiteral(C, u) {
    var valoracao = defineValores(C)

    var Cl = []
    var aux = []
    for (var i = 0; i < C.length; i++) {
        for (var j = 0; j < C[i].length; j++) {
            if (C[i][j] == u) {
                aux = []
                break
            }
            if (C[i][j].indexOf(u) == -1)
                aux.push(C[i][j])
            else {
                if (contaLiterais(valoracao[i]) == 1)
                    aux.push("")
            }
        }
        if (aux.length > 0)
            Cl.push(aux)
        aux = []
    }
    return Cl
}

function pegaAtomos(C) {
    var atomos = []
    for (var i = 0; i < C.length; i++)
        for (var j = 0; j < C[i].length; j++) {
            if (C[i][j].indexOf("-") != -1)
                atomos.push(C[i][j].slice(1, C[i][j].length))
            else {
                atomos.push(C[i][j])
            }
        }

    atomos = atomos.filter(
        function (atomo, pos, self) {
            return self.indexOf(atomo) == pos
        }
    )
    return atomos
}

function Simplifica(C) {
    var valoracao = defineValores(C)

    var Cl = C

    var u = clausulaUnitaria(valoracao)

    while (u != -1) { //enquanto Existe uma cláusula unitária u ∈ C 
        Cl = removeClausulaLiteral(Cl, Cl[u][0]) //C':= C' − {c|u é literal em c} // para toda cláusula c = ¬u ∨ c' faça C' := C' U {c'} − c

        valoracao = defineValores(Cl)

        u = clausulaUnitaria(valoracao)
        console.log(Cl)
    }

    return Cl
}

function contemBottom(C) {
    for (var i = 0; i < C.length; i++) {
        if (C[i].indexOf("") != -1) return true
    }

    return false
}

function DOISSAT(C) {

    var valoracao = defineValores(C)

    for (var i = 0; i < C.length; i++) {
        if (contaLiterais(valoracao[i]) > 2)
            return false
    }

    C = Simplifica(C)

    var Cl = []

    var atomos = pegaAtomos(C)
    var atomo = []
    var i = 0 //Escolha um átomo p qualquer em C
    while (!contemBottom(C) && C.length != 0 && i < atomos.length) { //enquanto ⊥ !∈ C e C != ∅
        atomo.push([atomos[i]])
        console.log("atomo escolhido:" + atomo[0])
        Cl = Simplifica(C.concat(atomo)) // C' := Simplifica(C ∪ {p})

        if (contemBottom(Cl)) { //se ⊥ ∈ C'
            atomo.push(["-" + atomos[i]])
            console.log("atomo escolhido:" + atomo[0])
            C = Simplifica(C.concat(atomo)) // C := Simplifica(C ∪ {¬p})
            atomo = []
        }

        else C = Cl
        i++

    }

    if (contemBottom(C)) return false //se ⊥ ∈ C

    else return true

}

//Quando clica no botão "Verificar"
btn_verificar.onclick = function () {

    var clausulas = formula.value.split("\n") // Separa as clausulas
    var C = []

    for (var i = 0; i < clausulas.length; i++) {
        C.push(clausulas[i].split(" "))
    }

    if (DOISSAT(C)) {
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