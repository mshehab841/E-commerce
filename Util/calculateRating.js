module.exports = (ratings)=>{
        if (ratings.length == 0 ){
            return 0
        }
        const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        const averageRating = totalRating / ratings.length;
        return Math.round(averageRating*10) / 10
}