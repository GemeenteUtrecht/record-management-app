import React from "react";
import Modal from 'react-modal';

import {DateInput} from "../../forms/inputs";
import {RadioSelect} from "../../forms/select";


const SUGGESTION_DISPLAY = {
    "remove": "Remove",
    "change_and_remove": "Change and remove"
};

const ARCHIEFNOMINATIE_CHOICES = [
    ["blijvend_bewaren", "blijvend bewaren"],
    ["vernietigen", "vernietigen"]
];


const ListItemModal = ({modalIsOpen, setIsOpen, listItem, zaak, setAction, archiveInputs}) => {
    const {archiefnominatie, setArchiefnominatie, archiefactiedatum, setArchiefactiedatum} = archiveInputs;
    const closeModal = () => setIsOpen(false);

    const currentAction = (
        archiefnominatie !== zaak.archiefnominatie || archiefactiedatum !== zaak.archiefactiedatum
            ? "change_and_remove"
            : "remove"
    );

    return (
        <Modal isOpen={modalIsOpen} className="modal">
            <article className="list-item-modal">
                <button onClick={closeModal} className="modal__close btn">&times;</button>
                <h1 className="title modal__title">{zaak.identificatie}</h1>

                <div className="modal__section">
                    <section className="content-panel modal__item">
                        <h2 className="section-title section-title--highlight">Review</h2>

                        <h3>Suggestion</h3>
                        <p>{SUGGESTION_DISPLAY[listItem.review_suggestion] || "No"}</p>

                        <h3>Remarks</h3>
                        <p>
                            { listItem.review_text ? listItem.review_text : "No comment"}
                        </p>
                    </section>
                    <section className="content-panel modal__item">
                        <h2 className="section-title section-title--highlight">Change data</h2>

                        <div className="list-item-modal__archiefnominatie">
                            <label><strong>Archiefnominatie</strong>
                            <RadioSelect
                                name="archiefnominatie"
                                choices={ARCHIEFNOMINATIE_CHOICES}
                                initialValue={archiefnominatie}
                                onChange={(e) => setArchiefnominatie(e.target.value)}
                            />
                        </label>
                        </div>

                        <div className="list-item-modal__archiefactiedatum">
                            <label><strong>Archiefactiedatum</strong>
                                <DateInput
                                    name="archiefactiedatum"
                                    initial={archiefactiedatum}
                                    onChange={(e) => setArchiefactiedatum(e.target.value)}
                                />
                            </label>
                        </div>
                    </section>
                </div>

                <div className="modal__buttons">
                    <button
                        onClick={(e) => {
                            setAction(currentAction);
                            closeModal();
                        }}
                        className="btn"
                    >{SUGGESTION_DISPLAY[currentAction]}
                    </button>

                    <button
                        onClick={(e) => {
                            setAction("");
                            setArchiefnominatie(zaak.archiefnominatie);
                            setArchiefactiedatum(zaak.archiefactiedatum);
                            closeModal();
                        }}
                        className="btn"
                    >Keep item
                    </button>
                </div>

            </article>
        </Modal>
    );
};

export { ListItemModal };

