import React, { useEffect, useState } from "react";
import api from "./services/api";

import "./global.css";
import "./App.css";
import "./sidebar.css";
import "./main.css";

function App() {
  const [devs, setDevs] = useState([]);
  const [github_username, setGitHubUserName] = useState("");
  const [techs, setTechs] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setlongitude] = useState("");

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get("/devs");

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setlongitude(longitude);
      },
      err => {
        console.log(err);
      },
      {
        timeout: 30000
      }
    );
  }, []);

  async function handleAddDev(e) {
    e.preventDefault();

    const response = await api.post("/devs", {
      github_username,
      techs,
      latitude,
      longitude
    });
    console.log(response.data);
  }
  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={handleAddDev}>
          <div className="input-block">
            <label htmlFor="github_username">Usuário do GitHub</label>
            <input
              name="github_username"
              id="github_username"
              required
              value={github_username}
              onChange={e => setGitHubUserName(e.target.value)}
            />
          </div>
          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input
              name="techs"
              id="techs"
              required
              value={techs}
              onChange={e => setTechs(e.target.value)}
            />
          </div>
          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="number"
                name="latitude"
                id="latitude"
                required
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
              />
            </div>
            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="number"
                name="longitude"
                id="longitude"
                required
                value={longitude}
                onChange={e => setlongitude(e.target.value)}
              />
            </div>
          </div>
          <button type="submit">Salvar</button>
        </form>
      </aside>
      <main>
        <ul>
          {devs ? (
            devs.map(dev => (
              <li className="dev-item">
                <header>
                  <img src={dev.avatar_url} alt={dev.github_username} />
                  <div className="user-info">
                    <strong>{dev.name}</strong>
                    <span>{dev.techs.join(",")}</span>
                  </div>
                </header>
                <p>{dev.bio}</p>
                <a
                  href={`https://github.com/${dev.github_username}`}
                  target="blank"
                >
                  Acessar perfil github
                </a>
              </li>
            ))
          ) : (
            <p>Nenhum Dev Proximo</p>
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;
