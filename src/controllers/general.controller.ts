import { NextFunction, Request, Response } from 'express';
import * as mongoose from 'mongoose';

import { Options, sendResponse } from '../utils';
import { GeneralService } from '../services';

export const create = async <T>(req: Request, res: Response, next: NextFunction, model: mongoose.Model<T>) => {
  try {
    const US = new GeneralService({
      model,
      currentUser: req.currentUser,
      locale: req.locale,
    });
    const response = await US.create(req.body);
    sendResponse({
      res,
      response,
      locale: req.locale,
    });
  } catch (e) {
    return next(e);
  }
};

export const getMany = async <T>(req: Request, res: Response, next: NextFunction, model: mongoose.Model<T>) => {
  try {
    const US = new GeneralService({
      model,
      currentUser: req.currentUser,
      locale: req.locale,
    });

    const options = Options(req);
    let filter = JSON.stringify({});
    if (req.query.conditions) {
      filter = req.query.conditions.toString();
    }
    let populate = null;
    if (req.query.populate) {
      populate = JSON.parse(req.query.populate.toString());
    }

    const response = await US.getMany({
      filter,
      projection: (req.query.fields ?? '').toString(),
      populate,
      options,
    });
    sendResponse({
      res,
      response,
      locale: req.locale,
    });
  } catch (e) {
    return next(e);
  }
};

export const getOne = async <T>(req: Request, res: Response, next: NextFunction, model: mongoose.Model<T>) => {
  try {
    const US = new GeneralService({
      model,
      currentUser: req.currentUser,
      locale: req.locale,
    });
    let populate = null;
    if (req.query.populate) {
      populate = JSON.parse(req.query.populate.toString());
    }
    const response = await US.getOne({
      filter: JSON.stringify({ _id: req.params.id }),
      projection: (req.query.fields ?? '').toString(),
      populate,
    });
    sendResponse({
      res,
      response,
      locale: req.locale,
    });
  } catch (e) {
    return next(e);
  }
};

export const update = async <T>(req: Request, res: Response, next: NextFunction, model: mongoose.Model<T>) => {
  try {
    const US = new GeneralService({
      model,
      currentUser: req.currentUser,
      locale: req.locale,
    });
    const response = await US.update({ id: req.params.id, update: req.body });
    sendResponse({
      res,
      response,
      locale: req.locale,
    });
  } catch (e) {
    return next(e);
  }
};

export const remove = async <T>(req: Request, res: Response, next: NextFunction, model: mongoose.Model<T>) => {
  try {
    const US = new GeneralService({
      model,
      currentUser: req.currentUser,
      locale: req.locale,
    });
    const response = await US.remove({ id: req.params.id });
    sendResponse({
      res,
      response,
      locale: req.locale,
    });
  } catch (e) {
    return next(e);
  }
};
