import {useEffect, useState, useRef} from 'react'
import "./filters.css"

export function Filter({filterKey, filterText, onRemoveFilterClicked, onFilterChanged, id}: {
    filterKey: string,
    filterText: string,
    onRemoveFilterClicked: (e: number) => any,
    onFilterChanged: (e: string, input: string, id: number) => any,
    id: number
}) {
    return <div>
        <select className="selectBox" key={id} onChange={(e) => {
            filterKey = e.target.value;
            onFilterChanged(e.target.value, filterText, id)
        }}>
            <option value="firstName">Имя</option>
            <option value="lastName">Фамилия</option>
            <option value="fatherName">Отчество</option>
            <option value="workPhoneNumber">Рабочий телефон</option>
            <option value="mobilePhoneNumber">Мобильный телефон</option>
            <option value="directorate">Дирекция</option>
            <option value="department">Департамент</option>
            <option value="unit">Отдел</option>
            <option value="service">Служба</option>
            <option value="jobTitle">Должность</option>


        </select>

        <input className="textInput" onChange={(e) => {
            filterText = e.target.value;
            onFilterChanged(filterKey, e.target.value, id)
        }}>

        </input>
        <button className="invisibleButton" onClick={() => {
            onRemoveFilterClicked(id);
            onFilterChanged("", "", id)
        }}>
            <img src="/delete-icon.svg" width="20" height="20" alt={"delete"}></img>
        </button>

    </div>
}

export function Filters({hidden, onFilterChange, onApplyButtonClicked}: {
    hidden: boolean,
    onFilterChange: (filterKey: string, filterText: string, id: number) => any,
    onApplyButtonClicked: () => any
}) {
    function removeFilter(id: number) {
        setFilters(filtersRef.current.filter((e: JSX.Element) => {
            return e.props.id !== id
        }))
    }

    useEffect(() => {
        filtersRef.current = filters
    });
    const [filters, setFilters] = useState([<Filter filterKey={"firstName"} filterText={""}
                                                    onRemoveFilterClicked={removeFilter} id={0} key={0}
                                                    onFilterChanged={onFilterChange}></Filter>])
    const filtersRef = useRef(filters);

    function addFilter() {
        const id = (filters.length > 0) ? filters.at(-1)?.props.id + 1 : 0;
        setFilters(filters.concat(<Filter filterKey={"firstName"} filterText={""} onRemoveFilterClicked={removeFilter}
                                          id={id} key={id} onFilterChanged={onFilterChange}></Filter>));
    }

    if (hidden) {
        return <div></div>
    }
    return (<div className="filtersContainer">{filters}
        <button onClick={addFilter} className="addFilterButton">Добавить фильтр</button>
        <button onClick={onApplyButtonClicked} className="addFilterButton">Применить</button>
    </div>)
}