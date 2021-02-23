const request = require("supertest");
const { app } = require("../../app");
let { players, objects } = require("../dataSource/dataSource");
const BASE_PLAYERS_URI = "/api/players";
const auth = { user: "rolmaster", password: "whowillwin?" };
const basicToken = "Basic " + btoa(auth.user + ":" + auth.password);
const notFoundMsg = (item) => item + " not found";

describe("Player-controller use case | List Players and createPlayer", () => {
  test("List all players | GET /api/players", async () => {
    const listPlayersResponse = await request(app)
      .get(BASE_PLAYERS_URI)
      .set("Authorization", basicToken);
    expect(listPlayersResponse.body).toEqual(players);
  });

  test("Create One player | POST /api/players", async () => {
    const newPlayer = {
      name: "Pepe",
      age: 50,
      health: 100,
      bag: [],
    };
    const successMsg = "Susccesfully created";

    createPlayerResponse = await request(app)
      .post(BASE_PLAYERS_URI)
      .set("Authorization", basicToken)
      .send(newPlayer);

    const { data, message } = createPlayerResponse.body;
    expect(createPlayerResponse.status).toBe(201);
    expect(data).toEqual({ ...newPlayer, id: 5 });
    expect(message).toEqual(successMsg);
  });

  test("TESTING FAILIURE: Create One player | POST /api/players", async () => {
    const badNewPlayer = {
      name: "Pepe",
      age: "not a number",
      health: 100,
      bag: [],
    };

    createPlayerResponse = await request(app)
      .post(BASE_PLAYERS_URI)
      .set("Authorization", basicToken)
      .send(badNewPlayer);
    expect(createPlayerResponse.status).toBe(400);
  });
});

describe("Player-controller use case | Get player by id", () => {
  test("Get player by Id | GET /api/players/:id", async () => {
    const requestedId = players[2].id;
    const expectedPlayer = { ...players[2] };

    const getPlayerResponse = await request(app)
      .get(BASE_PLAYERS_URI + "/" + requestedId)
      .set("Authorization", basicToken);
    expect(getPlayerResponse.status).toBe(200);
    expect(getPlayerResponse.body.data).toEqual(expectedPlayer);
  });

  test("TESTING FAILURE Get player by Id | GET /api/players/:id", async () => {
    const expectedMsg = notFoundMsg("Player");

    const getPlayerResponse = await request(app)
      .get(BASE_PLAYERS_URI + "/notExsitingId")
      .set("Authorization", basicToken);
    expect(getPlayerResponse.status).toBe(404);
    expect(getPlayerResponse.body.message).toEqual(expectedMsg);
  });
});

describe("Player-controller use case | Arm a player", () => {
  test("Arm player | PATCH /api/players/:id/arm/:objectId", async () => {
    const requestedId = players[2].id;
    const requestedObjectId = 2;
    const expectedPlayer = {
      ...players[2],
      bag: [...players[2].bag, requestedObjectId],
    };
    const expectedMsg = "Armed player with object" + requestedObjectId;

    const armPlayerResponse = await request(app)
      .patch(BASE_PLAYERS_URI + `/${requestedId}/arm/${requestedObjectId}`)
      .set("Authorization", basicToken);

    const { data, message } = armPlayerResponse.body;
    expect(armPlayerResponse.status).toBe(200);
    expect(data).toEqual(expectedPlayer);
    expect(message).toBe(expectedMsg);
  });

  test("TESTING FAILURE NOT EXISTING PLAYER | Arm player | PATCH /api/players/:id/arm/:objectId", async () => {
    const requestedId = "notExistingId";
    const requestedObjectId = 2;
    const expectedMsg = notFoundMsg("Player");

    const armPlayerResponse = await request(app)
      .patch(BASE_PLAYERS_URI + `/${requestedId}/arm/${requestedObjectId}`)
      .set("Authorization", basicToken);

    const { message } = armPlayerResponse.body;
    expect(armPlayerResponse.status).toBe(404);
    expect(message).toBe(expectedMsg);
  });

  test("TESTING FAILURE NOT EXISTING OBJECT | Arm player | PATCH /api/players/:id/arm/:objectId", async () => {
    const requestedId = 1;
    const requestedObjectId = "notExistingObject";
    const expectedMsg = notFoundMsg("Object");

    const armPlayerResponse = await request(app)
      .patch(BASE_PLAYERS_URI + `/${requestedId}/arm/${requestedObjectId}`)
      .set("Authorization", basicToken);

    const { message } = armPlayerResponse.body;
    expect(armPlayerResponse.status).toBe(404);
    expect(message).toBe(expectedMsg);
  });
});

describe("Player-controller use case | Kill a player", () => {
  test("Kill player | PATCH /api/players/:id/kill", async () => {
    const requestedId = players[3].id;
    const expectedPlayer = {
      ...players[3],
      health: 0,
    };
    const expectedMsg = "You kill him / her  :_(";

    const killPlayerResponse = await request(app)
      .patch(BASE_PLAYERS_URI + `/${requestedId}/kill`)
      .set("Authorization", basicToken);

    const { data, message } = killPlayerResponse.body;
    expect(killPlayerResponse.status).toBe(200);
    expect(data).toEqual(expectedPlayer);
    expect(message).toBe(expectedMsg);
  });

  test("TESTING FAILURE NOT EXISTING PLAYER | Kill player | PATCH /api/players/:id/kill", async () => {
    const requestedId = "notExistingId";
    const expectedMsg = notFoundMsg("Player");
    const killPlayerResponse = await request(app)
      .patch(BASE_PLAYERS_URI + `/${requestedId}/kill`)
      .set("Authorization", basicToken);

    const { message } = killPlayerResponse.body;
    expect(killPlayerResponse.status).toBe(404);
    expect(message).toBe(expectedMsg);
  });
});

describe("Player-controller use case | Use object", () => {
  test("Use object | PATCH /api/players/:carrierPlayerId/use/:recieverPlayerId/:objectId", async () => {
    const requestedCarrierId = players[1].id;
    const requestedRecieverId = players[3].id;
    const requestedObjectId = objects[1].id;
    const requestedObjectValue = objects[1].value;
    const expectedPlayer = {
      ...players[3],
      health: players[3].health + requestedObjectValue,
    };
    const expectedMsg = "Reciever health was updated";

    const useObjectResponse = await request(app)
      .patch(
        BASE_PLAYERS_URI +
          `/${requestedCarrierId}/use/${requestedRecieverId}/${requestedObjectId}`
      )
      .set("Authorization", basicToken);

    const { data, message } = useObjectResponse.body;
    expect(useObjectResponse.status).toBe(200);
    expect(data).toEqual(expectedPlayer);
    expect(message).toBe(expectedMsg);
  });

  test("TESTING FAILURE NOT EXISTING PLAYER | Use object | PATCH /api/players/:carrierPlayerId/use/:recieverPlayerId/:objectId", async () => {
    const requestedCarrierId = "notExistingId";
    const requestedRecieverId = "notExistingId";
    const requestedObjectId = objects[1].id;
    const expectedMsg = notFoundMsg("Carrier or Reciever player");

    const useObjectResponse = await request(app)
      .patch(
        BASE_PLAYERS_URI +
          `/${requestedCarrierId}/use/${requestedRecieverId}/${requestedObjectId}`
      )
      .set("Authorization", basicToken);

    const { message } = useObjectResponse.body;
    expect(useObjectResponse.status).toBe(404);
    expect(message).toBe(expectedMsg);
  });

  test("TESTING FAILURE PLAYER HAS NOT THE OBJECT | Use object | PATCH /api/players/:carrierPlayerId/use/:recieverPlayerId/:objectId", async () => {
    const requestedCarrierId = players[4].id;
    const requestedRecieverId = players[3].id;
    const requestedObjectId = objects[0].id;
    const expectedMsg = "Carrier does not have Object: " + requestedObjectId;

    const useObjectResponse = await request(app)
      .patch(
        BASE_PLAYERS_URI +
          `/${requestedCarrierId}/use/${requestedRecieverId}/${requestedObjectId}`
      )
      .set("Authorization", basicToken);

    const { message } = useObjectResponse.body;
    expect(useObjectResponse.status).toBe(400);
    expect(message).toBe(expectedMsg);
  });
});

describe("Player-controller use case | Steal a player", () => {
  test("Steal player | PATCH /api/players/steal/:stealerPlayerId/:victimPlayerId", async () => {
    const requestedStealerId = players[4].id;
    const requestedVictimId = players[2].id;
    const expectedStealer = {
      ...players[4],
      bag: [...players[4].bag, ...players[2].bag],
    };
    const expectedVictim = {
      ...players[2],
      bag: [],
    };
    const expectedMsg = `Player ${requestedStealerId} steal the whole bag from player ${requestedVictimId}`;

    const stealPlayerResponse = await request(app)
      .patch(
        BASE_PLAYERS_URI + `/steal/${requestedStealerId}/${requestedVictimId}`
      )
      .set("Authorization", basicToken);

    const { data, message } = stealPlayerResponse.body;
    expect(stealPlayerResponse.status).toBe(200);
    expect(data).toEqual({ stealer: expectedStealer, victim: expectedVictim });
    expect(message).toBe(expectedMsg);
  });

  test("TESTING FAILURE NOT EXISTING PLAYER | Steal player | PATCH /api/players/steal/:stealerPlayerId/:victimPlayerId", async () => {
    const requestedStealerId = "notExistingId";
    const requestedVictimId = "notExistingId";
    const expectedMsg = notFoundMsg("Stealer or victim player");

    const useObjectResponse = await request(app)
      .patch(
        BASE_PLAYERS_URI + `/steal/${requestedStealerId}/${requestedVictimId}`
      )
      .set("Authorization", basicToken);

    const { message } = useObjectResponse.body;
    expect(useObjectResponse.status).toBe(404);
    expect(message).toBe(expectedMsg);
  });

  test("TESTING FAILURE VICTIM HAS AN EMPTY BAG | Steal player | PATCH /api/players/steal/:stealerPlayerId/:victimPlayerId", async () => {
    console.log(players);
    const requestedStealerId = players[4].id;
    const requestedVictimId = players[2].id;
    const expectedMsg = notFoundMsg("Victim bag is empty,");

    const useObjectResponse = await request(app)
      .patch(
        BASE_PLAYERS_URI + `/steal/${requestedStealerId}/${requestedVictimId}`
      )
      .set("Authorization", basicToken);

    const { message } = useObjectResponse.body;
    expect(useObjectResponse.status).toBe(404);
    expect(message).toBe(expectedMsg);
  });
});

describe("Player-controller use case | Resurrect a Player", () => {
  test("Resurrect player | PATCH /api/players/:id/resurrect", async () => {
    const requestedPlayerId = players[3].id;
    const expectedPlayer = {
      ...players[3],
      health: 100,
    };

    const expectedMsg = `Health of player ${requestedPlayerId} fully restored`;

    const stealPlayerResponse = await request(app)
      .patch(BASE_PLAYERS_URI + `/${requestedPlayerId}/resurrect`)
      .set("Authorization", basicToken);

    const { data, message } = stealPlayerResponse.body;
    expect(stealPlayerResponse.status).toBe(200);
    expect(data).toEqual(expectedPlayer);
    expect(message).toBe(expectedMsg);
  });

  test("TESTING FAILURE NOT EXISTING PLAYER | Resurrect player | PATCH /api/players/:id/resurrect", async () => {
    const requestedPlayerId = "notExistingId";
    const expectedMsg = notFoundMsg("Player");

    const useObjectResponse = await request(app)
      .patch(BASE_PLAYERS_URI + `/${requestedPlayerId}/resurrect`)
      .set("Authorization", basicToken);

    const { message } = useObjectResponse.body;
    expect(useObjectResponse.status).toBe(404);
    expect(message).toBe(expectedMsg);
  });

  test("TESTING FAILURE ALREADY PLAYER WITH FULL HEALTH | Resurrect player | PATCH /api/players/:id/resurrect", async () => {
    const requestedPlayerId = players[0].id;
    const expectedMsg = "Player is already sooo healthy";

    const useObjectResponse = await request(app)
      .patch(BASE_PLAYERS_URI + `/${requestedPlayerId}/resurrect`)
      .set("Authorization", basicToken);

    const { data, message } = useObjectResponse.body;
    expect(useObjectResponse.status).toBe(400);
    expect(data).toBe(null);
    expect(message).toBe(expectedMsg);
  });
});
