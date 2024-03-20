import tunnelWorker from "./worker"


try  {
    await tunnelWorker.start()
}
catch (e)
{
    console.log("SOmething went wrong::", e)
}