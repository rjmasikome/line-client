"use strict";

import * as request from "request";
import * as Debug from "debug";

const debug: Debug = Debug("line-notify:client");
const UTF8: string = "utf8";
const SUCCESS_CODE: number = 200;

interface Config {
  key: string;
}

interface Notify {
  message: string;
  imageThumbnail?: string;
  imageFullsize?: string;
  imageFile?: string;
  stickerPackageId?: number;
  stickerId?: number;
}

export class LineClient {

  private config: Config | string;
  private options: any;
  private url: string;
  private key: string;

  constructor(config) {

    if (!config) {
      throw new Error("Please provide api key as constructor");
    }

    this.config = config;

    if (typeof this.config === "object" && !(this.config as Config).key) {
      throw new Error("Please provide key");
    }

    this.key = (typeof this.config === "object") ? (this.config as Config).key : this.config;
    this.config = config;
    this.url = "https://notify-api.line.me/api/";

  }

  private __request(options){

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {

        if (error) {
          return reject(error);
        }

        try {
          response = JSON.parse(response);
          body = JSON.parse(body);
        } catch (err) {
          debug("Unable to parse response / body", err);
        }

        debug("request done");

        if (response.statusCode !== SUCCESS_CODE){
          return reject(new Error(body));
        }

        resolve(body);
      });
    });

  }

  private __xwwwfurlenc(src){

    let urljson = "";
    const u = encodeURIComponent;
    const keys = Object.keys(src);

    keys.forEach((n, i, arr) => {
      urljson += encodeURIComponent(n) + "=" + encodeURIComponent(src[n]);
      if (i < arr.length - 1) {
        urljson += "&";
      }
    });

    return urljson;
  }

  public async notify(body: Notify | string, cb?: any){

    if (!body) {
      throw new Error("Please provide a message as body object or as string");
    }

    if (typeof body === "object" && !(body as Notify).message) {
      throw new Error("Please provide a message in a body");
    }

    if (typeof body === "string" && !body.includes("message=")) {
      body = `message=${body}`;
    }

    const options = {
      url: `${this.url}notify`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${this.key}`
      },
      body: typeof body === "object" ? this.__xwwwfurlenc(body) : body
    };

    try {
      const response = await this.__request(options);

      if (typeof cb === "function") {
        return cb(null, response);
      }

      return response;
    } catch (err) {

      if (typeof cb === "function") {
        return cb(err);
      }

      return Promise.reject(err);
    }
  }

}
