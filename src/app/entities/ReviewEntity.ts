import * as mongoose from "mongoose";
import { ReviewDocument } from "./documents/ReviewDocument";
import { ReviewSchema } from "../data/schemas/ReviewSchema";
import { IEntity } from "./IEntity";
import { AbstractEntity } from "./AbstractEntity";

/**
 * IReviewEntity interface. Describes custom functionality for
 * Review mongoose documents.
 * @author Mario Juez <mario@mjuez.com>
 */
export interface IReviewEntity extends IEntity<ReviewDocument> {
    
}

/**
 * Review Entity.
 * @author Mario Juez <mario@mjuez.com>
 */
export class ReviewEntity extends AbstractEntity<ReviewDocument> implements IReviewEntity {

    /**
     * Transforms raw data to IReviewEntity.
     * @param data  raw data.
     * @returns a review entity.
     */
    public static toEntity(data: any): IReviewEntity {
        if (data) {
            let entity: IReviewEntity = new ReviewEntity(<ReviewDocument>data);
            return entity;
        }
        return null;
    }

    /**
     * Transforms raw data to IReviewEntity array.
     * @param data  raw data.
     * @returns an array of review entities.
     */
    public static toEntityArray(data: any[]): IReviewEntity[] {
        let entityArray: IReviewEntity[] = [];
        if (data.length > 0) {
            data.map((jsonObject) => {
                let entity: IReviewEntity = this.toEntity(jsonObject);
                entityArray.push(entity);
            });
        }
        return entityArray;
    }

}