import { useEffect, useState } from "react";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import InfoTooltip from "./InfoTooltip/InfoTooltip";

function App() {
  const [popup, setPopup] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [userData, setUserData] = useState({ email: "" });
  const [messagePopup, setMessagePopup] = useState({
    message: "",
    link: "",
    linkalt: "",
  });

  const navigate = useNavigate();

  const location = useLocation();

  const handleRegistration = async ({ email, password }) => {
    try {
      await auth.register(email, password);
      navigate("/login");
      setMessagePopup({
        message: messages.registerTrue,
        link: trueImg,
        linkalt: messages.linkaltTrue,
      });
    } catch (error) {
      setMessagePopup({
        message: messages.registerFalse,
        link: falseImg,
        linkalt: messages.linkaltFalse,
      });
      console.error(error);
    }
  };

  const handleLogin = async ({ email, password }) => {
    if (!email || !password) {
      return;
    }

    try {
      const data = await auth.authorize(email, password);
      if (data.token) {
        setToken(data.token);
        setIsLoggedIn(true);
        setUserData({ email });
        setMessagePopup({
          message: messages.registerTrue,
          link: trueImg,
          linkalt: messages.linkaltTrue,
        });
        const redirectPath = location.state?.from?.pathname || "/my-perfil";
        navigate(redirectPath);
      }
    } catch (error) {
      setMessagePopup({
        message: messages.registerFalse,
        link: falseImg,
        linkalt: messages.linkaltFalse,
      });
      console.error(error);
    }
  };

  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await api.getUserInfo();
        setCurrentUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    const getInitialCardsData = async () => {
      try {
        const cards = await api.getInitialCards();
        setCards(cards);
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
    getInitialCardsData();
  }, []);

  async function handleCardLike(card) {
    const isLiked = card.isLiked;

    await api
      .addLike(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard,
          ),
        );
      })
      .catch((error) => console.error(error));
  }

  async function handleCardDelete(cardId) {
    try {
      const isId = cardId;
      await api.deleteCard(isId);

      setCards((state) => state.filter((card) => card._id !== isId));
    } catch (error) {
      console.error(error);
    }
  }

  const handleUpdateUser = (data) => {
    (async () => {
      await api
        .updateUserInfo(data)
        .then((newData) => {
          setCurrentUser(newData);
          handleClosePopup();
        })
        .catch((error) => console.error(error));
    })();
  };

  const handleUpdateAvatar = async (data) => {
    api
      .updateAvatar(data.avatar)
      .then((avatarUrl) => {
        const updateAvatar = {
          ...currentUser,
          avatar: avatarUrl.avatar,
          name: avatarUrl.name,
          about: avatarUrl.about,
        };
        setCurrentUser(updateAvatar);
        handleClosePopup();
      })
      .catch((err) => {
        console.log("No se ha actualizado el perfil:", err);
      });
  };

  const handleAddPlaceSubmit = (data) => {
    (async () => {
      setIsLoading(true);
      await api.addCard(data).then((newCard) => {
        setCards([newCard, ...cards]);
        setTimeout(() => {
          handleClosePopup();
          setIsLoading(false);
        }, 2000);
      });
    })();
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        messagePopup,
        isLoggedIn,
        handleUpdateUser,
        handleUpdateAvatar,
        handleAddPlaceSubmit,
      }}
    >
      <div className="page__content">
        <Header />
        <Routes>
          <Route
            path="/my-perfil"
            element={
              <ProtectedRoute>
                <Main
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={handleClosePopup}
                  popup={popup}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute anonymous>
                <Login handleLogin={handleLogin} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute anonymous>
                <Register handleRegistration={handleRegistration} />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate to="/my-perfil" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
