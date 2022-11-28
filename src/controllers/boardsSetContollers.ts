import { Response, Request } from 'express';
import * as boardService from '../services/board.service';


export const getBoardsByUser = async (req: Request, res: Response) => {
  try {
    const foundedBoards = await boardService.findBoardsByUser(req.params['userId']);
    res.json(foundedBoards);
  } catch (err) {
    console.log(err);
  }
};

export const getBoardsByIds = async (req: Request, res: Response) => {
  const ids = req.query.ids as string[];
  try {
    const allBoards = await boardService.findBoards();
    res.json(allBoards.filter(item => ids.includes(item._id)));
  } catch (err) {
    console.log(err);
  }
};

