import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import "../../blocks/info.css";

export default function InfoTooltip() {
  const { messagePopup } = useContext(CurrentUserContext);

  return (
    <div className="info__tooltip">
      <div className="info__tooltip-image">
        {messagePopup.link && (
          <img
            className="info__tooltip-img"
            src={messagePopup.link}
            alt={messagePopup.linkalt}
          />
        )}
      </div>
      <h2 className="info__paragraph">{messagePopup.message}</h2>
    </div>
  );
}
