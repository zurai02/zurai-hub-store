-- Roblox Executor Route Router
return function(targetId)
    local HttpService = game:GetService("HttpService")
    
    -- Dynamically locate the base repository path from your active loader
    -- This pulls your live, raw posts.json array directly into game memory
    local baseUrl = _G.ScriptHubBaseUrl or "https://githubusercontent.com"
    local success, response = pcall(function()
        return game:HttpGet(baseUrl .. "posts.json")
    end)
    
    if not success or not response then
        warn("[ScriptHub Error]: Failed to fetch posts.json index array over the network.")
        return
    end
    
    local decodeSuccess, scriptList = pcall(function()
        return HttpService:JSONDecode(response)
    end)
    
    if not decodeSuccess then
        warn("[ScriptHub Error]: posts.json contains syntax formatting errors.")
        return
    end
    
    -- Loop through the parsed table to find your target script ID
    local matchedScript = nil
    for _, script in pairs(scriptList) do
        if script.id == targetId then
            matchedScript = script
            break
        end
    end
    
    if matchedScript and matchedScript.content then
        local runSuccess, runError = pcall(loadstring(matchedScript.content))
        if not runSuccess then
            warn("[ScriptHub Error]: Runtime exception in execution: " .. tostring(runError))
        end
    else
        warn("[ScriptHub Error]: Script target identifier '" .. tostring(targetId) .. "' not found in database.")
    end
end
