import axios from "axios";
import IAM from "@/IAM";

const instance = axios.create({
  baseURL: process.env.VUE_APP_ARTISTS_API_BASEURL,
  json: true,
});

const headersDefault = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin":
    process.env.VUE_APP_ACCESS_CONTROL_ALLOW_ORIGIN,
  Accept: "*/*",
};

export default {
  async execute(method, resource, data, parameters) {
    return instance({
      method,
      url: resource,
      data,
      withCredentials: true,
      params: parameters,
      headers: headersDefault,
    })
      .then((response) => {
        let result = {
          status: response.status,
          data: response.data,
          error: null,
        };
        return result;
      })
      .catch((error) => {
        console.log(error);
        let result = null;
        if (error.response) {
          result = {
            status: error.response.status,
            data: error.response.data,
            error: error.message,
          };
        } else {
          result = { status: null, data: null, error: error.message };
        }
        return result;
      });
  },
  async getAlbum(id) {
    instance.defaults.headers.common["Authorization"] =
      "Bearer " + (await IAM.getToken());
    return this.execute("get", `/album/${id}`, null, id);
  },
  async listAlbums() {
    instance.defaults.headers.common["Authorization"] =
      "Bearer " + (await IAM.getToken());
    return this.execute("get", "/albums", null);
  },
  async deleteAlbum(id) {
    instance.defaults.headers.common["Authorization"] =
      "Bearer " + (await IAM.getToken());
    return this.execute("delete", `/album/${id}`, null);
  },
  async createAlbum(data) {
    instance.defaults.headers.common["Authorization"] =
      "Bearer " + (await IAM.getToken());
    let dataJSON = JSON.stringify(data);
    return this.execute("post", "/album", dataJSON);
  },
  async updateAlbum(data) {
    instance.defaults.headers.common["Authorization"] =
      "Bearer " + (await IAM.getToken());
    let dataJSON = JSON.stringify(data);
    return this.execute("put", "/album", dataJSON);
  },
  async addRoleUsuario(role) {
    instance.defaults.headers.common["Authorization"] =
      "Bearer " + (await IAM.getToken());
    return this.execute("put", "/addRole", null, role);
  },
  async listArtists() {
    instance.defaults.headers.common["Authorization"] =
      "Bearer " + (await IAM.getToken());
    return this.execute("get", "/artists", null);
  },
  listArtistsLocal() {
    let resultStr =
      '{\n    "json": [\n        [\n            {\n                "id": 1,\n                "twitter": "@justinbieber",\n                "name": "Justin Bieber"\n            }\n        ],\n        [\n            {\n                "id": 2,\n                "twitter": "@katyperry",\n                "name": "Katy Perry"\n            }\n        ],\n        [\n            {\n                "id": 3,\n                "twitter": "@rihanna",\n                "name": "Rihanna"\n            }\n        ],\n        [\n            {\n                "id": 4,\n                "twitter": "@taylorswift13",\n                "name": "Taylor Swift"\n            }\n        ],\n        [\n            {\n                "id": 5,\n                "twitter": "@ladygaga",\n                "name": "Lady Gaga"\n            }\n        ],\n        [\n            {\n                "id": 6,\n                "twitter": "@ArianaGrande",\n                "name": "Ariana Grande"\n            }\n        ],\n        [\n            {\n                "id": 7,\n                "twitter": "@jtimberlake",\n                "name": "Justin Timberlake"\n            }\n        ],\n        [\n            {\n                "id": 8,\n                "twitter": "@selenagomez",\n                "name": "Selena Gomez"\n            }\n        ],\n        [\n            {\n                "id": 9,\n                "twitter": "@britneyspears",\n                "name": "Britney Spears"\n            }\n        ],\n        [\n            {\n                "id": 10,\n                "twitter": "@ddlovato",\n                "name": "Demi Lovato"\n            }\n        ],\n        [\n            {\n                "id": 11,\n                "twitter": "@shakira",\n                "name": "Shakira"\n            }\n        ],\n        [\n            {\n                "id": 12,\n                "twitter": "@JLo",\n                "name": "Jennifer Lopez"\n            }\n        ],\n        [\n            {\n                "id": 13,\n                "twitter": "@MileyCyrus",\n                "name": "Miley Cyrus"\n            }\n        ],\n        [\n            {\n                "id": 14,\n                "twitter": "@BrunoMars",\n                "name": "Bruno Mars"\n            }\n        ],\n        [\n            {\n                "id": 15,\n                "twitter": "@NiallOfficial",\n                "name": "Niall Horan"\n            }\n        ],\n        [\n            {\n                "id": 16,\n                "twitter": "@Drake",\n                "name": "Drake"\n            }\n        ],\n        [\n            {\n                "id": 17,\n                "twitter": "@wizkhalifa",\n                "name": "Wiz Khalifa"\n            }\n        ],\n        [\n            {\n                "id": 18,\n                "twitter": "@Harry_Styles",\n                "name": "Harry Styles"\n            }\n        ],\n        [\n            {\n                "id": 19,\n                "twitter": "@LilTunechi",\n                "name": "Lil Wayne"\n            }\n        ]\n    ]\n}';
    let jsonObj = JSON.parse(resultStr);
    let jsonObjjson = jsonObj.json;
    let artists = [];
    jsonObjjson.forEach((element) => {
      artists.push(element[0]);
    });
    let result = {
      status: 200,
      data: artists,
    };
    return result;
  },
};
