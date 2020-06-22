import React, { Component } from 'react'

import Users from './Users'
import Roles from './Roles'

class UserManagement extends Component {
    
    state = {
        currentComponent: 'Users'
    }

    constructor(props) {
        super(props)
        this.switchTab = this.switchTab.bind(this)
    }

    getComponentToDisplay(){
        let component = null
        switch(this.state.currentComponent){
            case 'Users':
                component = <Users />
                break
            case 'Roles':
                component = <Roles />
                break
            default: 
                break
        }

        return component
    }

    switchTab(tabName){
        this.setState({
            currentComponent: tabName
        })
    }

    render() {
        return (
            <div>
                <div id='navBar' className='mb-5'>
                    <ul className='nav nav-pills nav-fill'>
                    <li className='nav-item text-black'>
                        <button className={this.state.currentComponent === 'Users' ? 'col nav-link active link-button' : ' col link-button'} onClick={() => this.switchTab('Users')}>Users</button>
                    </li>
                    <li className='nav-item'>
                        <button className={this.state.currentComponent === 'Roles' ? 'col nav-link active link-button' : 'col link-button'} onClick={() => this.switchTab('Roles')}>Roles</button>
                    </li>
                    </ul>
                </div>
                <div className="jumbotron">
                    {this.getComponentToDisplay()}
                </div>
            </div>
        );
    }
}

export default UserManagement;