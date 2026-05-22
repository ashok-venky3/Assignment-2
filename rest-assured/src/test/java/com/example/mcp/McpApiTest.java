package com.example.mcp;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.notNullValue;

class McpApiTest {

    @BeforeAll
    static void setup() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = 4000;
    }

    @Test
    void healthEndpointReturnsOk() {
        given()
            .when()
            .get("/health")
            .then()
            .statusCode(200)
            .body("status", equalTo("ok"))
            .body("uptimeSeconds", greaterThan(0));
    }

    @Test
    void contextEndpointAcceptsPayload() {
        String payload = "{\n"
            + "  \"userId\": \"user-123\",\n"
            + "  \"sessionId\": \"session-abc\",\n"
            + "  \"data\": { \"feature\": \"rest-assured\" }\n"
            + "}";

        given()
            .contentType(ContentType.JSON)
            .body(payload)
            .when()
            .post("/context")
            .then()
            .statusCode(200)
            .body("message", equalTo("MCP context accepted"))
            .body("received.userId", equalTo("user-123"))
            .body("received.sessionId", equalTo("session-abc"))
            .body("received.data.feature", equalTo("rest-assured"));
    }

    @Test
    void excelCreateEndpointReturnsWorkbookBase64() {
        String requestBody = "{\n"
            + "  \"sheets\": [\n"
            + "    {\n"
            + "      \"name\": \"Sheet1\",\n"
            + "      \"data\": [[\"A1\", \"B1\"], [\"A2\", \"B2\"]]\n"
            + "    }\n"
            + "  ]\n"
            + "}";

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
            .when()
            .post("/excel/create")
            .then()
            .statusCode(200)
            .body("message", equalTo("excel created"))
            .body("sheetNames[0]", equalTo("Sheet1"))
            .body("workbookBase64", notNullValue());
    }

    @Test
    void fileUploadAndDownloadWork() {
        byte[] fileBytes = "hello rest assured".getBytes();

        String storedFileName =
            given()
                .multiPart("files", "test.txt", fileBytes, "text/plain")
                .when()
                .post("/files/upload")
                .then()
                .statusCode(200)
                .body("message", equalTo("files uploaded"))
                .extract()
                .path("files[0].storedName");

        given()
            .when()
            .get("/files/" + storedFileName)
            .then()
            .statusCode(200)
            .header("content-disposition", equalTo("attachment; filename=\"" + storedFileName + "\""));
    }
}
