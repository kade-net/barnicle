import 'dotenv/config'
import tunnelWorker from "./worker"


try  {

    let starting_sequence = process.env.STARTING_SEQUENCE_NUMBER! ? parseInt(process.env.STARTING_SEQUENCE_NUMBER!) : 0

    starting_sequence = Number.isNaN(starting_sequence) ? 0 : starting_sequence

    await tunnelWorker.start(starting_sequence)
}
catch (e)
{
    console.log("SOmething went wrong::", e)
}