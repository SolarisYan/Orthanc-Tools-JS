import React, { Component, Fragment } from "react"
import Toggle from 'react-toggle'
import apis from "../../../services/apis"

class Ldap extends Component {

    state = {
        check: false
    }

    constructor(props) {
        super(props)
        this.changeMode=this.changeMode.bind(this)
    }

    async getModeFromDB() {
        return await apis.options.getMode()
    }

    async componentWillMount() {
        let value = await this.getModeFromDB()
        console.log(value)
        this.setState({check: value})
    }

    async changeMode() {
        this.setState(prevState =>({check: !prevState.check}))
        await apis.options.changeMode(!this.state.check)
    }

    render() {
        return (
            <Fragment>
                <h2 className='card-title'>Distant Users Panel</h2>
                <div>
                    <div className="row mt-5 mb-3">
                        <div className='col-auto'>
                            <h5>LDAP/AD connexion</h5>
                        </div> 
                        <div className='col-auto'>
                            <Toggle checked={this.state.check} onChange={this.changeMode} />
                        </div>
                    </div>    
                    <div className="form-group">
                        <div className="row">
                            <div className='col'>
                                <label htmlFor="address">Address : </label>
                                <input type='text' disabled={!this.state.check} name="LdapAddress" className="row form-control" onChange={this.handleChange} value={this.state.LdapAddress} placeholder="http://" />
                            </div>
                            <div className='col'>
                                <label htmlFor="port">Port : </label>
                                <input type='number' disabled={!this.state.check} min="0" max="999999" name="LDAPPort" className="row form-control" value={this.state.LdapPort} onChange={this.handleChange} />  
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className='col'>
                                <label htmlFor="username">Username : </label>
                                <input type='text' disabled={!this.state.check} name="LdapUsername" className="row form-control" value={this.state.LdapUsername} onChange={this.handleChange} />
                            </div>
                            <div className='col'>
                                <label htmlFor="password">Password : </label>
                                <input type='password' disabled={!this.state.check} name="LdapPassword" className="row form-control" value={this.state.LdapPassword} onChange={this.handleChange} />
                            </div>
                        </div>            
                    </div>
                    <div className="form-group text-right">
                    <input type='button' disabled={!this.state.check} className='btn btn-primary mr-1' onClick={this.submitOrthancSettings} value='Update' />
                    <input type='button' disabled={!this.state.check} className='btn btn-info mr-1' onClick={this.testConnexion} value='Check Connexion' />
                    </div>         
                </div>

                <div>
                    
                </div>
            </Fragment>         
        )
    }    
}    

export default Ldap;