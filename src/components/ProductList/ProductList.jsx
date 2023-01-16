import React, {useCallback, useEffect, useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";

const products = [
    {id: '1', title: 'Джинсы 1', price: 5000, description: 'Синий цвет, прямые'},
    {id: '2', title: 'Куртка 1', price: 12000, description: 'Чёрный цвет, зимняя'},
    {id: '3', title: 'Джинсы 2', price: 4000, description: 'Зелёный цвет, зауженные'},
    {id: '4', title: 'Куртка 8', price: 33000, description: 'Розовый цвет, демисезон'},
    {id: '5', title: 'Джинсы 3', price: 11000, description: 'Серый цвет, узкие'},
    {id: '6', title: 'Куртка 7', price: 2000, description: 'Желтый цвет, осенняя'},
    {id: '7', title: 'Джинсы 4', price: 5500, description: 'Белый цвет, свободные'},
    {id: '8', title: 'Куртка 5', price: 8000, description: 'Красный цвет, весенняя'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('https://localhost:8000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product]
        }

        setAddedItems(newItems)

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }
    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem product={item} onAdd={onAdd} className={'item'}/>
            ))}
        </div>
    );
};

export default ProductList;