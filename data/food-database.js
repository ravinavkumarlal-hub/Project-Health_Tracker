const foodDatabase = [
    { name: 'Rice', calories: 130, portion: '1 cup' },
    { name: 'Roti', calories: 265, portion: '1 roti' },
    { name: 'Naan', calories: 262, portion: '1 naan' },
    { name: 'Chicken Curry', calories: 165, portion: '1 serving' },
    { name: 'Dal', calories: 81, portion: '1 cup' },
    { name: 'Paneer', calories: 265, portion: '100g' },
    { name: 'Banana', calories: 89, portion: '1 fruit' },
    { name: 'Egg', calories: 155, portion: '1 egg' },
    { name: 'Milk', calories: 61, portion: '1 cup' },
    { name: 'Water', calories: 0, portion: '1 cup' }
];

function searchFood(query) {
    return foodDatabase.filter(food => 
        food.name.toLowerCase().includes(query.toLowerCase())
    );
}