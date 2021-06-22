import { useEffect, useState } from "react"
import { SearchPanel } from "./search-panel"
import { List } from "./list"
import * as qs from 'qs'
import { cleanObject } from "utils"
const apiUrl = process.env.REACT_APP_API_URL

export const ProjectListScreen = () => {
    const [users, setUsers] = useState([])

    const [param, setParam] = useState({
        name: '',
        personId: ''
    })
    const [list, setList] = useState([])

    useEffect(() => {
        fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(param))}`).then(async res => {
            console.log(res)

            if(res.ok){
                setList(await res.json())
                console.log(list)
            }
        })
    }, [param])


    useEffect(() => {
        fetch(`${apiUrl}/users`).then(async res => {
            if(res.ok){
                setUsers(await res.json())
            }
        })
    }, [param])
    return <div>
        <SearchPanel param={param} setParam={setParam} users={users}>
            <List users={users} list={list}/>
        </SearchPanel>
        <List list={list} users={users}/>
    </div>
}