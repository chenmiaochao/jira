import { useEffect, useState } from "react"
import { SearchPanel } from "./search-panel"
import { List } from "./list"
import * as qs from 'qs'
import { cleanObject, useDebounce } from "utils"
const apiUrl = process.env.REACT_APP_API_URL

export const ProjectListScreen = () => {
    const [users, setUsers] = useState([])

    const [param, setParam] = useState({
        name: '',
        personId: ''
    })
    const [list, setList] = useState([])

    const debouncedParam = useDebounce(param, 2000);

    useEffect(() => {
        fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(debouncedParam))}`).then(async res => {
            console.log(res)

            if(res.ok){
                setList(await res.json())
                console.log(list)
            }
        })
    }, [debouncedParam])


    useMount(() => {
        fetch(`${apiUrl}/users`).then(async res => {
            if(res.ok){
                setUsers(await res.json())
            }
        })
    })
    return <div>
        <SearchPanel param={param} setParam={setParam} users={users}>
            <List users={users} list={list}/>
        </SearchPanel>
        <List list={list} users={users}/>
    </div>
}

export const useMount = (callback) => {
    useEffect(() => {
        callback()
    },[])
}