// @ts-check
import { test, expect } from '@playwright/test';

const trelloApiBaseUrl = 'https://api.trello.com/1';
const trelloKey = process.env.TRELLO_KEY ?? "Set TRELLO_KEY in .env file";
const trelloToken = process.env.TRELLO_TOKEN ?? "Set TRELLO_TOKEN in .env file";

test.describe('Trello Boards API', () => {

  test('should create a board', async ({ request }) => {
    const boardName = `pw-api-create-${Date.now()}`;
    const desc = 'Created by Playwright API test';

    const createResponse = await request.post(`${trelloApiBaseUrl}/boards/`, {
      params: {
        key: trelloKey,
        token: trelloToken,
        name: boardName,
        desc: desc,
      },
    });

    expect(createResponse.ok()).toBeTruthy();
    const createdBoard = await createResponse.json();
    expect(createdBoard.id).toBeTruthy();
    expect(createdBoard.name).toBe(boardName);
    expect(createdBoard.desc).toBe(desc);

    const getCreatedResponse = await request.get(`${trelloApiBaseUrl}/boards/${createdBoard.id}`, {
      params: {
        key: trelloKey,
        token: trelloToken,
      },
    });

    expect(getCreatedResponse.ok()).toBeTruthy();
    const fetchedBoard = await getCreatedResponse.json();
    expect(fetchedBoard.id).toBe(createdBoard.id);
    expect(fetchedBoard.name).toBe(boardName);
    expect(fetchedBoard.desc).toBe(desc);

    const deleteResponse = await request.delete(`${trelloApiBaseUrl}/boards/${createdBoard.id}`, {
      params: {
        key: trelloKey,
        token: trelloToken,
      },
    });

     expect(deleteResponse.ok()).toBeTruthy();
  });

  test('should update a board', async ({ request }) => {
    const initialBoardName = `pw-api-update-initial-${Date.now()}`;
    const updatedBoardName = `pw-api-update-final-${Date.now()}`;
    const initialDesc = 'Created by Playwright API test'
    const updatedDesc = 'Updated by Playwright API test'

    const createResponse = await request.post(`${trelloApiBaseUrl}/boards/`, {
      params: {
        key: trelloKey,
        token: trelloToken,
        name: initialBoardName,
        desc: initialDesc,
      },
    });

    expect(createResponse.ok()).toBeTruthy();
    const createdBoard = await createResponse.json();

    const getCreatedResponse = await request.get(`${trelloApiBaseUrl}/boards/${createdBoard.id}`, {
      params: {
        key: trelloKey,
        token: trelloToken,
      },
    });

    expect(getCreatedResponse.ok()).toBeTruthy();
    const fetchedCreatedBoard = await getCreatedResponse.json();
    expect(fetchedCreatedBoard.id).toBe(createdBoard.id);
    expect(fetchedCreatedBoard.name).toBe(initialBoardName);
    expect(fetchedCreatedBoard.desc).toBe(initialDesc);

    const updateResponse = await request.put(`${trelloApiBaseUrl}/boards/${createdBoard.id}`, {
      params: {
        key: trelloKey,
        token: trelloToken,
        name: updatedBoardName,
        desc: updatedDesc,
      },
    });

    expect(updateResponse.ok()).toBeTruthy();
    const updatedBoard = await updateResponse.json();
    expect(updatedBoard.id).toBe(createdBoard.id);
    expect(updatedBoard.name).toBe(updatedBoardName);
    expect(updatedBoard.desc).toBe(updatedDesc);

    const deleteResponse = await request.delete(`${trelloApiBaseUrl}/boards/${createdBoard.id}`, {
      params: {
        key: trelloKey,
        token: trelloToken,
      },
    });

    expect(deleteResponse.ok()).toBeTruthy();
  });

  test('should delete a board', async ({ request }) => {
    const boardName = `pw-api-delete-${Date.now()}`;

    const createResponse = await request.post(`${trelloApiBaseUrl}/boards/`, {
      params: {
        key: trelloKey,
        token: trelloToken,
        name: boardName,
      },
    });

    expect(createResponse.ok()).toBeTruthy();
    const createdBoard = await createResponse.json();

    const getCreatedResponse = await request.get(`${trelloApiBaseUrl}/boards/${createdBoard.id}`, {
      params: {
        key: trelloKey,
        token: trelloToken,
      },
    });

    expect(getCreatedResponse.ok()).toBeTruthy();
    const fetchedCreatedBoard = await getCreatedResponse.json();
    expect(fetchedCreatedBoard.id).toBe(createdBoard.id);
    expect(fetchedCreatedBoard.name).toBe(boardName);

    const deleteResponse = await request.delete(`${trelloApiBaseUrl}/boards/${createdBoard.id}`, {
      params: {
        key: trelloKey,
        token: trelloToken,
      },
    });

    expect(deleteResponse.ok()).toBeTruthy();

    const getDeletedResponse = await request.get(`${trelloApiBaseUrl}/boards/${createdBoard.id}`, {
      params: {
        key: trelloKey,
        token: trelloToken,
      },
    });

    expect(getDeletedResponse.status()).toBe(404);
  });
});