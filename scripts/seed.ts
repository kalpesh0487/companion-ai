const {PrismaClient} = require('@prisma/client');

const db = new PrismaClient();

async function main(){
    try {
        await db.catagory.createMany({
            data: [
                {name: 'Technology'},
                {name: 'Sports'},
                {name: 'Politics'},
                {name: 'Business'},
                {name: 'Health'},
                {name: 'Science/Tech'},
                {name: 'World'},
                {name: 'Entertainment'},
                {name: 'Education'},
                {name: 'Science/Nature'},
                {name: 'Family'},
            ],
        })
    } catch (error) {
        console.log("error: ",error)
    }finally{
        await db.$disconnect();
    }
}

main();