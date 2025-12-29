import React, { createContext, useContext, useEffect, useState } from 'react';
import agent from '../api/agent';
import { v4 as uuidv4 } from 'uuid';

const StoreContext = createContext(undefined);

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}

export function StoreProvider({ children }) {
    const [basket, setBasket] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const basketId = localStorage.getItem('basket_id');
        if (basketId) {
            agent.Basket.get(basketId)
                .then(basket => setBasket(basket))
                .catch(error => console.log(error))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            agent.Account.currentUser()
                .then(user => setUser(user))
                .catch(error => {
                    console.log(error);
                    localStorage.removeItem('token');
                });
        }
    }, []);

    const getCookie = (name) => {
        // Not actually using cookies for basket ID, using localStorage as per plan
        return localStorage.getItem(name);
    }

    function addItemToBasket(product, quantity = 1) {
        const item = mapProductToBasketItem(product, quantity);
        let basketId = localStorage.getItem('basket_id');
        if (!basketId) {
            basketId = uuidv4();
            localStorage.setItem('basket_id', basketId);
        }

        const currentBasket = basket ?? { id: basketId, items: [] };
        const existingItemIndex = currentBasket.items.findIndex(i => i.id === item.id);

        let newItems = [...currentBasket.items];
        if (existingItemIndex >= 0) {
            newItems[existingItemIndex].quantity += quantity;
        } else {
            newItems.push(item);
        }

        const updatedBasket = { ...currentBasket, id: basketId, items: newItems };
        setBasket(updatedBasket); // Optimistic UI update

        agent.Basket.addItem(updatedBasket)
            .then(b => setBasket(b))
            .catch(error => console.log(error));
    }

    function removeItemFromBasket(productId, quantity = 1) {
        if (!basket) return;

        const itemIndex = basket.items.findIndex(i => i.id === productId);
        if (itemIndex === -1) return;

        let newItems = [...basket.items];
        if (newItems[itemIndex].quantity > quantity) {
            newItems[itemIndex].quantity -= quantity;
        } else {
            newItems.splice(itemIndex, 1);
        }

        const updatedBasket = { ...basket, items: newItems };
        setBasket(updatedBasket);

        if (newItems.length === 0) {
            agent.Basket.removeItem(basket.id)
                .then(() => {
                    localStorage.removeItem('basket_id');
                    setBasket(null);
                });
        } else {
            agent.Basket.addItem(updatedBasket)
                .catch(error => console.log(error));
        }
    }

    const mapProductToBasketItem = (product, quantity) => {
        return {
            id: product.id,
            productName: product.name,
            price: product.price,
            quantity,
            pictureUrl: product.pictureUrl,
            brand: product.productBrand,
            category: product.productType
        }
    }

    const login = async (values) => {
        const user = await agent.Account.login(values);
        setUser(user);
        localStorage.setItem('token', user.token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        setBasket(null);
        // Clear basket logic? For now clear local state, maybe server side keeps it but we lose the ID if guest.
        localStorage.removeItem('basket_id');
    };

    return (
        <StoreContext.Provider value={{ basket, setBasket, addItemToBasket, removeItemFromBasket, user, setUser, login, logout, loading }}>
            {children}
        </StoreContext.Provider>
    );
}
