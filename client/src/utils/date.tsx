const Getdate = () => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const date = ` ${month} ${year}`;

    return date
}

export default Getdate