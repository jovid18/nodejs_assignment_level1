// ProductSchema를 mongoose.Schema로 생성
//요소는 크게  상품명, 작성 내용, 작성자명, 비밀번호, 상품상태, 작성날짜
//다음은 각 요소에 대한 설명
//상품명(title): String 타입으로, 필수 요소
//작성 내용(content): String 타입으로, 필수 요소.
//작성자명(author): String 타입으로, 필수 요소
//비밀번호(password): String 타입으로, 필수 요소
//상품상태(status): FOR_SALE, SOLD_OUT의 상태를 가질 수 있음.상품 등록시 기본 상태는 FOR_SALE로 설정
//작성날짜(createdAt): Date 타입으로, 기본값은 현재 날짜로 설정

import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["FOR_SALE", "SOLD_OUT"],
        default: "FOR_SALE",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model("Product", ProductSchema);