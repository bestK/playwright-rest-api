import { config } from './load.config';

const fetch = (url, init) =>
  import('node-fetch').then(module => module.default(url, init));

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function postJson(
  url,
  data,
  headers = { 'Content-Type': 'application/json' }
) {
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  });

  return await response.json();
}

async function postForm(
  url,
  data,
  headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
) {
  const formData = new URLSearchParams();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: formData,
  });

  return await response.json();
}

async function getJson(url, headers = {}) {
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });

  return await response.json();
}

async function uploadFile(url, file, name = 'file', headers = {}) {
  const formData = new FormData();
  formData.append(name, file);

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: formData,
  });

  return await response.json();
}

async function downloadFile(url, headers = {}) {
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  }).then(response => response.blob());

  return await response.json();
}

/**
 *
 * 解析验证码
 *
 * @param {string} url 图片地址
 * @param {string} imageBase64 图片base64
 * @param {BinaryData} file 图片文件
 * @param {any} headers
 * @returns
 */
async function getCaptcha(
  url,
  imageBase64,
  file,
  headers = { 'Content-Type': 'multipart/form-data' }
) {
  const response = await fetch(config.ocr.endpoint, {
    method: 'post',
    headers: headers,
    data: {
      url: url,
      imageBase64: imageBase64,
      file: file,
    },
  });

  return await response.json();
}

module.exports = {
  sleep,
  postJson,
  postForm,
  getJson,
  uploadFile,
  downloadFile,
};
