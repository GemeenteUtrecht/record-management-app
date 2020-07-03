import React, {useState} from "react";
import { Collapse } from "react-collapse";

import {CheckboxInput} from "./inputs";


const add = (value, arr, setState) => {
    if (arr.includes(value)) {
        return;
    }
    const newArr = [...arr];
    newArr.push(value);

    setState(newArr);
};

const remove = (value, arr, setState) => {
    if (!arr.includes(value)) {
        return;
    }
    const newArr = arr.filter(x => x !== value);
    setState(newArr);
};


const ZaaktypeSelect = ({zaaktypen, selectedZaaktypen, setSelectedZaaktypen}) => {
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState([]);

    const addZaak = (value) => add(value, selectedZaaktypen, setSelectedZaaktypen);
    const removeZaak = (value) => remove(value, selectedZaaktypen, setSelectedZaaktypen);

    const addGroup = (value) => add(value, selectedGroups, setSelectedGroups);
    const removeGroup = (value) => remove(value, selectedGroups, setSelectedGroups);

    const expand = (value) => add(value, expandedGroups, setExpandedGroups);
    const collapse = (value) => remove(value, expandedGroups, setExpandedGroups);

    const ZaaktypeItem = ({index, value, label}) => (
        <li key={index}>
            <label>
                <CheckboxInput
                    initial={value}
                    name="zaaktype-item"
                    checked={selectedZaaktypen.includes(value)}
                    onChange={(event) => {
                        if (event.target.checked){
                            addZaak(value);
                        } else {
                            removeZaak(value);
                            removeGroup(description);
                        }
                    }}
                />
                {label}
            </label>
        </li>
    );

    const groups = zaaktypen.map( ([description, choices], index) => {
        const buttonIcon = (expandedGroups.includes(description) ? "-" : "+");

        const checkboxes = choices.map(([value, label], index) => (
            <ZaaktypeItem index={index} value={value} label={label}/>
        ));

        return (
            <li key={index}>
                <button
                    className="zaaktype-select__btn"
                    type="button"
                    onClick={(event) => {
                        const action = expandedGroups.includes(description) ? collapse : expand;
                        action(description);
                    }}
                >{buttonIcon}
                </button>
                <label>
                    <CheckboxInput
                        initial={description}
                        name="zaaktype-group"
                        checked={selectedGroups.includes(description)}
                        onChange={(event) => {
                            if (event.target.checked) {
                                addGroup(description);
                                choices.forEach(([value, label]) => addZaak(value));
                            } else {
                                removeGroup(description);
                                choices.forEach(([value, label]) => removeZaak(value));
                            }
                        }}
                    />
                    {`${description}:`}
                </label>

                <Collapse isOpened={expandedGroups.includes(description)}>
                    <ul className="zaaktype-select__items">
                        {checkboxes}
                    </ul>
                </Collapse>
            </li>
        );
    });

    return (
        <div className="zaaktype-select">
            <ul className="zaaktype-select__groups">
                { groups }
            </ul>
        </div>
    );
}


export { ZaaktypeSelect };
