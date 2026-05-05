import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

export default buildModule("ForceAttack", (m) => {
  const forceAddr = "0xc7E4781Bf949C03722cc7Ee6defb502Cb2065486";
  const attacker = m.contract("ForceAttack", [forceAddr], {
    value: parseEther("0.00001"),
  });

  return { attacker };
});
