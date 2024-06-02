//App.js

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import MainMakePage from "./pages/make/MainMakePage.jsx";
import MakePage from "./pages/make/MakePage.jsx";
import SharePage from "./pages/make/SharePage.jsx";
import MainTestPage from "./pages/quiz/MainTestPage.jsx";
import ScoreDetailPage from "./pages/quiz/ScoreDetailPage.jsx";
import ScorePage from "./pages/quiz/ScorePage.jsx";
import TestPage from "./pages/quiz/TestPage.jsx";





function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/friend_test/main/make" element={<MainMakePage/>}></Route>
                <Route path="/friend_test/make/:name" element={<MakePage/>}></Route>
                <Route path="/friend_test/share/:quizId" element={<SharePage/>}></Route>

                <Route path="/friend_test/main/test/:quizId" element={<MainTestPage/>}></Route>
                <Route path="/friend_test/test/:quizId" element={<TestPage/>}></Route>
                <Route path="/friend_test/score/:answerNo" element={<ScorePage/>}></Route>

                <Route path="/friend_test/score-detail/:answerNo" element={<ScoreDetailPage/>}></Route>
                <Route path="/friend_test/" element={<Navigate to="/friend_test/main/make" replace />} />
                <Route path="/" element={<Navigate to="/friend_test/main/make" replace />} />
            </Routes>
        </BrowserRouter>
    )
    }
export default App;
