import './errorPopup.css';

export function ErrorPopup({onCloseButtonClicked, errorMessage, hidden}: {
    onCloseButtonClicked: () => any,
    errorMessage: String,
    hidden: boolean
}) {
    if (!hidden) {
        return (
            <div className="errorContainer">
                <p className='errorMessage'>{errorMessage}</p>
                <button className='closeButton' onClick={onCloseButtonClicked}>x</button>
            </div>
        )
    } else {
        return (<div></div>)
    }
}
