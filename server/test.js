const autocannon = require("autocannon");

autocannon(
    {
        url: "http://localhost:5000/api/event/all-events",
        connections: 5000,
        pipelining: 3,
        duration: 10,
    },
    console.log
);
