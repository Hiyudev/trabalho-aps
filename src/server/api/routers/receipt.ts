import { ReceiptController } from "../modules/receipts/receipt.controller";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const receiptRouter = ReceiptController.create();