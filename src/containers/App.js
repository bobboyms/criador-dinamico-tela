import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import uuid from "uuid/v1";
import $ from "jquery";

class App extends React.Component {

  state = {

    alertas:[],

    formulario : [
       {tipo:"text", id:1, valor:"", placeholder:"Aqui voce vai digitar seu nome", label: "Digite seu nome",
       func: eval("(valor)=> {if (valor.trim().length == 0) {return false;}return true;}"),
       msgErro:"Campo nome nao pode ser vazio"},

       {tipo:"text", id:2, valor:"kalho doido", placeholder:"", label: "Digite seu email",
       func: (valor)=> {

          if (valor.trim().length == 0) {
            return false;
          }

        return true;

       }, msgErro:"Campo email nao pode ser vazio"},
       {tipo:"password", id:3, valor:"", placeholder:"", label: "Digite sua senha"},
       {tipo:"select",id:4, label:"Selecione alguma coisa", 
                      options:[
                              {valor:"01", id:"opt1"},
                              {valor:"02", id:"opt2"}, 
                              {valor:"03", id:"opt3"}]
       },
       {tipo:"text", id:5, valor:"", placeholder:"", label: "Digite seu telefone"},
       {tipo:"text", id:6, valor:"", placeholder:"", label: "Digite seu sobre nome"},
       
       {tipo:"radio", id:7, valor:"", index:"rd3", label: "Selecione RADIO", 
                      options:[
                              {valor:"abacaxi", id:"rd1"},
                              {valor:"abobora", id:"rd2"}, 
                              {valor:"cebola", id:"rd3"}]
      },
      {tipo:"checkbox", id:8, valor:[{index:"ch1"},{index:"ch3"}],label: "Selecione Checkbox", 
                      options:[
                              {valor:"morango", id:"ch1"},
                              {valor:"banana", id:"ch2"}, 
                              {valor:"abacaxi", id:"ch3"}]
      },
      
       
    ]
  }

  validaAntesDeSalvar() {

    const { formulario } = this.state;

    let alertas = [];

    formulario.map((valor)=>{

      if (valor.func != undefined) {
        console.log(valor.func)
        let validou = valor.func(valor.valor);

        if (validou == false) {
           document.getElementById(valor.id).style = "border-color: red";
           console.log(valor.msgErro);
           alertas.push(valor.msgErro)
        } else {
          document.getElementById(valor.id).style = "border-color: none";
        }
        
      }

    });

    this.setState({alertas})

  }

  resetaFormulario() {

    this.state.formulario.map((valor)=>{
      
      if (valor.tipo === "text" || valor.tipo === "password") {
          let valorNovo = valor;
          valorNovo.valor = ""
          this.setState({valorNovo})
          document.getElementById(valor.id).style = "border-color: none";
      } else if (valor.tipo === "radio") {
          let novoValor = valor;  
          novoValor.index = null;
          novoValor.valor = ""
          this.setState({novoValor})

          valor.options.map((valor) => {
              document.getElementById(valor.id).checked = false
          })
          //console.log(novoValor)
      } else if (valor.tipo === "checkbox") {
          let novoValor = valor;  
          novoValor.valor = [];
          this.setState({novoValor})

          valor.options.map((valor) => {
              document.getElementById(valor.id).checked = false
          })
      }
    });

    let alertas = []
    this.setState({alertas})
  }

  atualizaDomComponentes() {
    this.state.formulario.map((valor)=>{
      
      if (valor.tipo === "radio") {
        let radio = document.getElementById(valor.index);
        radio.checked = true
      } else if (valor.tipo === "checkbox") {
        valor.valor.map((valor) => {
          let check = document.getElementById(valor.index);
          check.checked = true
        });
      }
    });
  }

  componentDidMount() {
      this.atualizaDomComponentes()
  }

  atualizaValorCampoInput = (campo, valor) => {

    let novoCampo = campo;

    novoCampo["valor"] = valor;
    this.setState( { novoCampo })

    //console.log({ ...this.state, campo })

  }

  atualizaValorCheckbox = (campo, filho) => {
    
    let novoCampo = campo;
    let selecionados = []
    campo.options.map((valor)=>{
          let check = document.getElementById(valor.id);
          if (check.checked == true) {
             selecionados.push({index:valor.id, valor:valor.valor})
          }
    });
    novoCampo["valor"] = selecionados;
    this.setState({novoCampo})
    console.log(novoCampo)
  }

  atualizaValorCampoRadio = (campo,filho) => {
    let novoCampo = campo;

    let index = document.getElementById(filho.id).value;
    let valor = filho.valor;

    novoCampo["index"] = index;
    novoCampo["valor"] = valor;

    this.setState({novoCampo})
    console.log(novoCampo)
  }

  atualizaValorCampoSelect = (campo) => {

    let novoCampo = campo;

    let x = document.getElementById(novoCampo.id).selectedIndex;
    let y = document.getElementById(novoCampo.id).options;
    //alert("Index: " + y[x].index + " is " + y[x].value);

    novoCampo["index"] = y[x].index;
    novoCampo["valor"] = y[x].value;

    this.setState({novoCampo})
    console.log(novoCampo)

  }


  renderizaComponente() {
    
    const { formulario } = this.state;

    let arComponentes = formulario.map((valor, index)=>{
                    
      if (valor.tipo === "text") {
        return(<InputText 
          atualizaValorCampoInput={this.atualizaValorCampoInput}
          componente={valor} />);
      } else if (valor.tipo === "select") {
        return (<Select
          atualizaValorCampoSelect={this.atualizaValorCampoSelect}
          componente={valor}/>);
      } else if (valor.tipo === "password") {
        return(<InputText 
          atualizaValorCampoInput={this.atualizaValorCampoInput}
          componente={valor} />);
      } else if (valor.tipo === "radio") {
        return(<Radio
          atualizaValorCampoRadio={this.atualizaValorCampoRadio}
          componente={valor} />);
      } else if (valor.tipo === "checkbox") {
        return(<Checkbox
          atualizaValorCheckbox={this.atualizaValorCheckbox}
          componente={valor} />);
      }
      
    })

    return(arComponentes);
    
  }

  render() {

    const { alertas } = this.state;

      return(
        <div className="container-fluid">
            <div className="row">
                {alertas.map((valor, index)=>{
                  return(
                    <div key={index} className="alert alert-danger alert-fixed col-sm-12" role="alert" id="#myModal">
                        {valor} 
                    </div>
                  );
                })}
                {this.renderizaComponente()}
              </div>
           <h1>{this.state.texto}</h1>
          
          <button className="btn btn-success" onClick={() => {
            console.log(this.state.formulario)
          }}>
            VER FORMULARIO
          </button>

          <br />

          <button className="btn btn-success" onClick={() => {
            this.validaAntesDeSalvar();
          }}>
            VALIDAR ANTES DE SALVAR
          </button>

          <button className="btn btn-success" onClick={() => {
            this.resetaFormulario();
          }}>
            RESETA FORMULARIO
          </button>

        </div>
      )
  }
}

const InputText = ({componente, atualizaValorCampoInput}) => {
  return(
    <div className="form-group col-sm-4">
      <label >{componente.label}</label>
      <input type={componente.tipo} placeholder={componente.placeholder} value={componente.valor} className="form-control form-control-lg" id={componente.id} onChange={(e) => {
          atualizaValorCampoInput(componente,e.target.value)
    }} />
    </div>
  )
}

const Radio = ({componente, atualizaValorCampoRadio}) => {
  return(
    <div className="form-group col-sm-4">
      <label >{componente.label}</label>
      {componente.options.map((valor, index)=> {
            return(
                  <div key={valor.id.toString()} className="form-check">
                    <input className="form-check-input" type="radio" name="exampleRadios" id={valor.id} value={valor.id} 
                      onClick={() => {
                        atualizaValorCampoRadio(componente,valor)
                    }}/>
                    <label className="form-check-label" htmlFor="exampleRadios1">
                      {valor.valor}
                    </label>
                  </div>
            );
      })}
          
    </div>
  )
}

const Checkbox = ({componente, atualizaValorCheckbox}) => {
  return(
    <div className="form-group col-sm-4">
      <label >{componente.label}</label>
      {componente.options.map((valor, index)=> {
            return(
                  <div key={valor.id.toString()} className="form-check">
                    <input className="form-check-input" type="checkbox" id={valor.id} value={valor.id} 
                      onClick={() => {
                        atualizaValorCheckbox(componente, valor)
                    }}/>
                    <label className="form-check-label">
                      {valor.valor}
                    </label>
                  </div>
            );
      })}
          
    </div>
  )
}

const Select = ({componente, atualizaValorCampoSelect}) => {

    return(
      <div className="form-group col-sm-4">
        <label htmlFor="exampleFormControlSelect1">{componente.label}</label>
        <select className="form-control form-control-lg" id={componente.id} onChange={
          () => {
             atualizaValorCampoSelect(componente)
          }
        }>
          {componente.options.map((valor, index)=> {
            return(
                  <option key={valor.id} value={valor.texto}>
                    {valor.valor}
                  </option>);
          })}
  
        </select>
      </div>
    );

}


export default App;
